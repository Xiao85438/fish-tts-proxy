export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // 只处理 /v1/tts 接口
    if (url.pathname !== "/v1/tts") {
      return new Response("未找到接口", { status: 404 })
    }

    // 真实的 TTS 接口地址
    const upstream = "https://api.openai.com/v1/audio/speech"

    // 读取请求体
    const body = await request.arrayBuffer()

    // 转发请求到真实接口
    const resp = await fetch(upstream, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": request.headers.get("content-type")
      },
      body
    })

    // 原样返回音频数据
    return new Response(resp.body, {
      status: resp.status,
      headers: {
        "Content-Type": resp.headers.get("content-type")
      }
    })
  }
}
