const express = require("express");

const Memorial = require("../models/memorial");
const {
    authenticateRequest,
    requireAdmin,
    requireAuth,
} = require("../utils/auth");
const { escapeRegex, parseBoolean } = require("../utils/parsing");
const { parseMemorialPayload } = require("../validators/memorialPayload");

const memorialRouter = express.Router();

function buildListQueryOptions(query) {
    const limit = Math.max(0, parseInt(query.limit) || 0) || undefined;
    const includeUnapproved = parseBoolean(query.includeUnapproved) === true;
    const approvedFilter = parseBoolean(query.approved);
    const searchTerm = query.search?.trim() || "";

    const filter = {};

    if (!includeUnapproved) {
        filter.approved = true;
    } else if (typeof approvedFilter === "boolean") {
        filter.approved = approvedFilter;
    }

    if (searchTerm) {
        filter.searchText = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const sortDirection = query.sortDirection === "asc" ? 1 : -1;
    const sortOptions = {
        createdAt: { createdAt: sortDirection },
        updatedAt: { updatedAt: sortDirection },
        publishedAt: { publishedAt: sortDirection, createdAt: sortDirection },
        birthDate: { birthDate: sortDirection },
        deathDate: { deathDate: sortDirection },
    };

    const sort =
        sortOptions[query.sortBy] ||
        (includeUnapproved
            ? { updatedAt: -1 }
            : { publishedAt: -1, createdAt: -1 });

    return { filter, includeUnapproved, limit, sort };
}

function applyUpdates(memorial, updates, unsetFields) {
    Object.assign(memorial, updates);
    unsetFields.forEach((field) => (memorial[field] = undefined));
}

memorialRouter.get("/self", requireAuth, async (req, res) => {
    try {
        const memorials = await Memorial.find({ createdBy: req.user.sub })
            .sort({ updatedAt: -1, createdAt: -1 })
            .exec();

        return res.json({ memorials });
    } catch (error) {
        console.error("Failed to fetch user memorials:", error);
        return res.status(500).json({ error: "Failed to fetch memorials" });
    }
});

memorialRouter.get("/:memorialId", async (req, res) => {
    const authPayload = authenticateRequest(req);

    try {
        const memorial = await Memorial.findById(req.params.memorialId);

        if (!memorial) {
            return res.status(404).json({ error: "Memorial not found" });
        }

        // Check if user can view this memorial
        const isAdmin = authPayload?.isAdmin;
        const isOwner = authPayload?.sub === String(memorial.createdBy);

        if (!memorial.approved && !isAdmin && !isOwner) {
            return res.status(404).json({ error: "Memorial not found" });
        }

        return res.json({ memorial });
    } catch (error) {
        console.error("Failed to fetch memorial:", error);
        if (error?.name === "CastError") {
            return res.status(400).json({ error: "Invalid memorial id" });
        }
        return res.status(500).json({ error: "Failed to fetch memorial" });
    }
});

memorialRouter.get("/", async (req, res) => {
    const { filter, includeUnapproved, limit, sort } = buildListQueryOptions(
        req.query
    );

    if (includeUnapproved) {
        const authPayload = authenticateRequest(req);

        if (!authPayload?.isAdmin) {
            return res.status(authPayload ? 403 : 401).json({
                error: authPayload
                    ? "Admin access required"
                    : "Authentication required",
            });
        }
    }

    try {
        let query = Memorial.find(filter).sort(sort);
        if (limit) query = query.limit(limit);

        const memorials = await query.exec();
        return res.json({ memorials });
    } catch (error) {
        console.error("Failed to fetch memorials:", error);
        return res.status(500).json({ error: "Failed to fetch memorials" });
    }
});

memorialRouter.post("/", requireAuth, async (req, res) => {
    if (req.body?.approved !== undefined) {
        return res
            .status(400)
            .json({ error: "approved cannot be set when creating a memorial" });
    }

    const { errors, updates } = parseMemorialPayload(req.body, {
        requireAllFields: true,
    });

    if (errors.length > 0) {
        return res
            .status(400)
            .json({ error: "Invalid memorial submission", details: errors });
    }

    try {
        const memorial = await Memorial.create({
            ...updates,
            createdBy: req.user.sub,
            approved: false,
        });

        return res.status(201).json({ memorial });
    } catch (error) {
        console.error("Failed to create memorial:", error);
        return res.status(500).json({ error: "Failed to create memorial" });
    }
});

memorialRouter.patch("/:memorialId/self", requireAuth, async (req, res) => {
    if (req.body?.approved !== undefined) {
        return res
            .status(400)
            .json({ error: "approved cannot be modified by memorial owners" });
    }

    const { errors, updates, unsetFields, hasUpdates } = parseMemorialPayload(
        req.body
    );

    if (errors.length > 0) {
        return res
            .status(400)
            .json({ error: "Invalid memorial update", details: errors });
    }

    if (!hasUpdates) {
        return res.status(400).json({ error: "No updates provided" });
    }

    try {
        const memorial = await Memorial.findById(req.params.memorialId);

        if (!memorial) {
            return res.status(404).json({ error: "Memorial not found" });
        }

        if (String(memorial.createdBy) !== req.user.sub) {
            return res.status(403).json({
                error: "You do not have permission to update this memorial",
            });
        }

        applyUpdates(memorial, updates, unsetFields);
        memorial.approved = false; // Reset approval on edit

        await memorial.save();
        return res.json({ memorial });
    } catch (error) {
        console.error("Failed to update memorial:", error);
        return res.status(500).json({ error: "Failed to update memorial" });
    }
});

memorialRouter.delete("/:memorialId/self", requireAuth, async (req, res) => {
    try {
        const memorial = await Memorial.findById(req.params.memorialId);

        if (!memorial) {
            return res.status(404).json({ error: "Memorial not found" });
        }

        if (String(memorial.createdBy) !== req.user.sub) {
            return res.status(403).json({
                error: "You do not have permission to delete this memorial",
            });
        }

        await memorial.deleteOne();
        return res.json({ success: true });
    } catch (error) {
        console.error("Failed to delete memorial:", error);
        return res.status(500).json({ error: "Failed to delete memorial" });
    }
});

memorialRouter.patch("/:memorialId", requireAdmin, async (req, res) => {
    const { errors, updates, unsetFields, hasUpdates } = parseMemorialPayload(
        req.body
    );

    if (errors.length > 0) {
        return res
            .status(400)
            .json({ error: "Invalid memorial update", details: errors });
    }

    if (!hasUpdates) {
        return res.status(400).json({ error: "No updates provided" });
    }

    try {
        const memorial = await Memorial.findById(req.params.memorialId);

        if (!memorial) {
            return res.status(404).json({ error: "Memorial not found" });
        }

        applyUpdates(memorial, updates, unsetFields);
        await memorial.save();

        return res.json({ memorial });
    } catch (error) {
        console.error("Failed to update memorial:", error);
        return res.status(500).json({ error: "Failed to update memorial" });
    }
});

memorialRouter.patch(
    "/:memorialId/approval",
    requireAdmin,
    async (req, res) => {
        const parsedApproved = parseBoolean(req.body?.approved);

        if (typeof parsedApproved !== "boolean") {
            return res
                .status(400)
                .json({ error: "approved must be provided as true or false" });
        }

        try {
            const memorial = await Memorial.findById(req.params.memorialId);

            if (!memorial) {
                return res.status(404).json({ error: "Memorial not found" });
            }

            memorial.approved = parsedApproved;
            await memorial.save();

            return res.json({ memorial });
        } catch (error) {
            console.error("Failed to update approval status:", error);
            return res
                .status(500)
                .json({ error: "Failed to update approval status" });
        }
    }
);

memorialRouter.delete("/:memorialId", requireAdmin, async (req, res) => {
    try {
        const memorial = await Memorial.findByIdAndDelete(
            req.params.memorialId
        );

        if (!memorial) {
            return res.status(404).json({ error: "Memorial not found" });
        }

        return res.json({ success: true });
    } catch (error) {
        console.error("Failed to delete memorial:", error);
        return res.status(500).json({ error: "Failed to delete memorial" });
    }
});

module.exports = {
    memorialRouter,
};
