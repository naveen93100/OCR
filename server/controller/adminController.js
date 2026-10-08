import Lead from "../models/LeadModel.js";
import User from "../models/userModel.js";


export const getDashBoardData = async (req, res) => {
    try {

        let executives = await User.aggregate([
            {
                $match: {
                    role: 'executive'
                }
            },
            {
                $lookup: {
                    from: 'leads',
                    localField: 'userId',
                    foreignField: 'executiveUserId',
                    as: "leads"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    role: 1,
                    userId: 1,
                    leads: {
                        $map: {
                            input: "$leads",
                            as: "lead",
                            in: {
                                _id: "$$lead._id",
                                customerName: "$$lead.customerName",
                                city: "$$lead.city",
                                requirement: "$$lead.requirement",
                                mobileNo: "$$lead.mobileNo",
                                email: "$$lead.email",
                                createdAt:"$$lead.createdAt"
                            }
                        }
                    }
                }
            }
        ]);

        return res.status(200).json({ success: true, executives });

    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}

export const createAdmin = async (req, res) => {
    try {
        let { name, password, role } = req.body;

        if (!name || !password || !role) return res.status(400).json({ success: false, message: "Fields are missing" });


        let user = await User.create({
            name,
            password,
            role
        })

        return res.status(201).json({ success: true, message: "Created.", user });

    } catch (er) {
        return res.status(500).json({
            success: false,
            message: er?.message
        });
    }
};

export const createMarketingPerson = async (req, res) => {
    try {

        let { name, role, password } = req.body;

        if (!name || !role || !password) return res.status(400).json({ success: false, message: "Fields are missing.." });

        let validRole = ['super_admin', 'executive'];

        if (!validRole.includes(role)) return res.status(400).json({ success: false, message: "Invalid role.." });

        let user = await User.create({
            name,
            role,
            password
        })

        return res.status(201).json({ success: true, message: 'userId created.', data: { _id: user._id, name: user.name, role: user.role, userId: user.userId } })

    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}

export const downloadExcel = async (req, res) => {
    try {

    } catch (er) {
        return res.status(500).json({ success: false, message: er?.message });
    }
}