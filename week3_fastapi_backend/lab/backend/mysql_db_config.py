import asyncio
import aiomysql
# pip install cryptography


class DB:
    def __init__(self):
        self.db_url = {
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "password": "mocha123",
            "db": "admin_ecom",
        }
    async def get_connection(self):
        return await aiomysql.connect(**self.db_url)


async def main():
    db = DB()
    conn = await db.get_connection()
    async with conn.cursor() as cursor:
        await cursor.execute("SELECT * FROM users")
        result = await cursor.fetchall()
        print(result)
    conn.close()

if __name__ == "__main__":
    asyncio.run(main())

