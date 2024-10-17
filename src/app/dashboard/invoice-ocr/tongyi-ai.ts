import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.DASH_SCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

export async function invoiceJSONConversion(
  string: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        {
          role: "system",
          content: `你现在是一个JSON数据转换器。我会发给你一串关于发票、火车票、机票信息相关的json数据。你需要阅读json的key和value,并按照以下要求转换成一个新的json。

新的json中的key需要包括:{type: "发票类型（普票,专票,车票等）",purchase:"消费类型,类似打车票,机票订单,住宿票,餐饮消费等",seller:"卖家信息",location:"消费地点,如果没有对地点标注那么一般是根据卖家名字来判断,如果是上海xxx有限公司那么默认为上海,如果是机票、火车票,那么以到达地,arrival location,所在城市作为消费地点" , amount: "消费金额", date:"消费日期", comment: "发票中的备注部分。若发票类型为火车票，则填写出发地和到达地信息"} 

请你只给我json string, 不要有其他的信息`,
        },
        { role: "user", content: string },
      ],
      temperature: 0.2,
      top_p: 0.9,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("错误生成单轮对话:", error);
    throw error;
  }
}
