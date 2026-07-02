import asyncio
import asyncpg

class DB:
    def __init__(self):
        self.db_url = {
            "host": "localhost",
            "port": 5432,
            "user": "postgres",
            "password": "mocha123",
            "database": "retail_db1",
        }
        self.pool = None

    async def connect(self):
        self.pool = await asyncpg.create_pool(
            host=self.db_url["host"],
            port=self.db_url["port"],
            user=self.db_url["user"],
            password=self.db_url["password"],
            database=self.db_url["database"],
            min_size=1,
            max_size=10
        )

    async def fetch(self, query, *args):
        async with self.pool.acquire() as connection:
            return await connection.fetch(query, *args)

    async def close(self):
        await self.pool.close()

# Example usage
async def main():
    db = DB()
    await db.connect()
    rows = await db.fetch("SELECT * FROM retail.staging_sales")
    for row in rows:
        print(row)
    await db.close()

if __name__ == "__main__":
    asyncio.run(main())

# async def main():
#     db = DB()
#     await db.connect()
#
#     await db.insert(
#         "INSERT INTO users (username, email) VALUES ($1, $2)",
#         "nashu", "nashu@example.com"
#     )
#
#     # Optional: fetch to verify
#     rows = await db.fetch("SELECT * FROM users")
#     for row in rows:
#         print(dict(row))  # or just print(row)
#
#     await db.close()
#
# if __name__ == "__main__":
#     asyncio.run(main())