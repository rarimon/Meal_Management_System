

export const VerifyRole = (allowedRoles) => (req, res, next) => {
    // JWT middleware already req.headers.role set করছে
    const userRole = req.headers.role;

    if (!userRole) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    // allowedRoles একটি array, উদাহরণ: ["admin", "manager"]
    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ status: "error", message: "Access denied" });
    }

    // সব ঠিক থাকলে next
    next();
};
