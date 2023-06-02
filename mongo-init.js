db.createUser(
    {
        user: "user",
        pwd: "Passw0rd",
        roles: [
            {
                role: "readWrite",
                db: "base"
            }
        ]
    }
);