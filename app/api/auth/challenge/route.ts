import NodeCache from "node-cache";
import { generateChallenge } from "@/app/actions/challenge";

const myCache = new NodeCache();

export async function GET ()  {
  const value = myCache.get('myKey')

  return Response.json({
    value
  });
}

export async function POST (request: Request) {
  const res = await request.json()
  myCache.set('myKey', 'hola', 10000)
  console.log(res)
  const challenge = await generateChallenge(res.address)

  console.log({challenge, res})

  return Response.json({
    ok: true,
    message: 'done',
    // data: {
    //   challenge
    // }
  });
}
