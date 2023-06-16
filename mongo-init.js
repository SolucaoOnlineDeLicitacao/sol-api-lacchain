db.createUser(
    {
        user: "sol",
        pwd: "sua senha",
        roles: [
            {
                role: "readWrite",
                db: "sol-db"
            }
        ]
    }
);