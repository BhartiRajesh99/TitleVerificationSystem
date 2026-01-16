import Title from "../models/Title.models.js";

const getTodayRequestsCount = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();

    const todayCount = await Title.countDocuments({
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    return res.status(200).json({
      success: true,
      count: todayCount,
    });

  } catch (error) {
    console.error("Error fetching today's requests:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch today's requests",
    });
  }
};

const getAdminDashboardStats = async (req, res) => {
  const [total, approved, rejected] = await Promise.all([
    Title.countDocuments(),
    Title.countDocuments({ verified: true }),
    Title.countDocuments({ verified: false }),
  ]);

  const approvedPercentage =
    total === 0 ? 0 : Math.round((approved / total) * 100);

  const rejectedPercentage =
    total === 0 ? 0 : Math.round((rejected / total) * 100);

  res.json({
    success: true,
    total,
    approved,
    rejected,
    approvedPercentage,
    rejectedPercentage,
  });
};

const getRejectionInsights = async (req, res) => {
  try {
    const rejectedTitles = await Title.find(
      { verified: false },
      {
        similarity: 1,
        soundex: 1,
        metaphone: 1,
        verificationProbability: 1,
      }
    );

    const total = rejectedTitles.length;

    if (total === 0) {
      return res.status(200).json({
        success: true,
        insights: {
          semantic: 0,
          rule: 0,
          phonetic: 0,
          other: 0,
        },
      });
    }

    let semantic = 0;
    let rule = 0;
    let phonetic = 0;
    let other = 0;

    rejectedTitles.forEach((doc) => {
      if (doc.verificationProbability < 30) {
        rule++;
      } else if (doc.similarity >= 70) {
        semantic++;
      } else if (doc.soundex || doc.metaphone) {
        phonetic++;
      } else {
        other++;
      }
    });

    const percent = (count) =>
      Math.round((count / total) * 100);

    return res.status(200).json({
      success: true,
      insights: {
        semantic: percent(semantic),
        rule: percent(rule),
        phonetic: percent(phonetic),
        other: percent(other),
      },
      totalRejected: total,
    });
  } catch (error) {
    console.error("Rejection insights error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate rejection insights",
    });
  }
};

const getProbabilityBreakdown = async (req, res) => {
  try {
    const results = await Title.aggregate([
      {
        $bucket: {
          groupBy: "$verificationProbability",
          boundaries: [0, 21, 51, 81, 101],
          default: "other",
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    const total = results.reduce((sum, r) => sum + r.count, 0);

    const breakdown = {
      "0-20": 0,
      "21-50": 0,
      "51-80": 0,
      "81-100": 0,
    };

    results.forEach(item => {
      if (!total) return;

      const percentage = Math.round((item.count / total) * 100);

      switch (item._id) {
        case 0:
          breakdown["0-20"] = percentage;
          break;
        case 21:
          breakdown["21-50"] = percentage;
          break;
        case 51:
          breakdown["51-80"] = percentage;
          break;
        case 81:
          breakdown["81-100"] = percentage;
          break;
      }
    });

    return res.status(200).json({
      success: true,
      totalTitles: total,
      breakdown,
    });

  } catch (error) {
    console.error("Probability breakdown error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch probability breakdown",
    });
  }
};

const getTopStatesBySubmissions = async (req, res) => {
  try {
    const totalTitles = await Title.countDocuments();

    if (totalTitles === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const results = await Title.aggregate([
      {
        $group: {
          _id: "$state",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 4 }, // Top 4 states
    ]);

    const formatted = results.map(item => ({
      state: item._id,
      percentage: Math.round((item.count / totalTitles) * 100),
    }));

    return res.status(200).json({
      success: true,
      totalTitles,
      states: formatted,
    });

  } catch (error) {
    console.error("Top states aggregation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch top states by submissions",
    });
  }
};

const getRecentSubmissions = async (req, res) => {
  try {
    const submissions = await Title.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",        
          localField: "createdBy",  
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          role: "$userDetails.role"
        }
      },
      {
        $project: {
          userDetails: 0
        }
      }
    ]);

    console.log(submissions[0])

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("Recent submissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent submissions",
    });
  }
};


export { getTodayRequestsCount, getAdminDashboardStats, getRejectionInsights, getProbabilityBreakdown, getTopStatesBySubmissions, getRecentSubmissions };