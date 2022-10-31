import json
import asyncio
import websockets
import connection
async def echo(websocket):
    async for message in websocket:
        await websocket.send("server : " + json.dumps(message))
        print("client : " + message)

        data = json.loads(message)
        count = data["count"]
        walletAddress = data["walletAddress"]
        print(count, walletAddress)

        connection.transferAUT(count, walletAddress)


async def main():
    async with websockets.serve(echo, "localhost", 5268):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())