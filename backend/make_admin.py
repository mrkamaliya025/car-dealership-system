import sqlite3

conn = sqlite3.connect("dealership.db")
cursor = conn.cursor()

cursor.execute("SELECT id, email, is_admin FROM users")

rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()