import Mock from "mockjs";

// 2.1 查询用户信息接口
// 接口路径待补充，这里使用 /api/activity/info 作为示例路径
Mock.mock(/\/api\/activity\/info/, "get", (options) => {
  const urlParams = new URLSearchParams(options.url.split("?")[1]);
  const activityId = parseInt(urlParams.get("activity_id"));

  // 如果活动不是进行中，返回错误
  // 这里可以根据activityId判断，示例中假设activityId为11011时活动进行中
  if (activityId !== 11011) {
    return {
      err_code: 1,
      error_msg: "找不到活动",
      result: null,
    };
  }

  return {
    err_code: 0,
    error_msg: "",
    result: {
      // 活动状态，0-未开始 1-进行中 2-已结束
      activity_status: Mock.Random.pick([0, 1, 2]),
      // 组件信息
      components: [
        {
          // 组件id
          id: 1,
          // 组件类型，0-头 1-身体 2-武器
          type: 0,
          // 组件状态，0-未解锁 1-已解锁
          status: Mock.Random.pick([0, 1]),
        },
        {
          id: 2,
          type: 1,
          status: Mock.Random.pick([0, 1]),
        },
        {
          id: 3,
          type: 2,
          status: Mock.Random.pick([0, 1]),
        },
      ],
    },
  };
});

// 2.2 触发攻击接口
// 接口路径待补充，这里使用 /api/activity/attack 作为示例路径
Mock.mock(/\/api\/activity\/attack/, "post", (options) => {
  const body = JSON.parse(options.body);
  const { activity_id, button_id } = body;

  // 如果活动不是进行中，返回错误
  if (activity_id !== 11011) {
    return {
      err_code: 1,
      error_msg: "活动不在进行中",
      result: null,
    };
  }

  // 返回参考info接口返回的latest_play_info结构
  return {
    err_code: 0,
    error_msg: "",
    result: {
    },
  };
});

// 2.3 上传图片接口
// 接口路径待补充，这里使用 /api/activity/upload 作为示例路径
Mock.mock(/\/api\/activity\/upload/, "post", (options) => {
  // 处理form表单数据
  // 注意：Mock.js无法直接处理FormData，这里模拟处理
  // 实际使用时，axios会自动将FormData转换为字符串，这里需要解析
  // 如果options.body是FormData对象，需要特殊处理
  let activityId = null;
  // 尝试从请求中获取activity_id
  // 如果是FormData，axios会将其转换为字符串，需要解析
  if (options.body) {
    if (typeof options.body === "string") {
      // 尝试从字符串中解析activity_id
      const match = options.body.match(/activity_id["']?\s*[:=]\s*["']?(\d+)/);
      if (match) {
        activityId = match[1];
      }
    } else if (options.body.activity_id) {
      activityId = options.body.activity_id;
    }
  }

  // 验证activity_id（防止黑产）
  if (!activityId) {
    return {
      err_code: 1,
      error_msg: "activity_id参数缺失",
      result: null,
    };
  }

  // 生成随机的图片URL和MD5
  const imageUrl = Mock.Random.image(
    "800x600",
    Mock.Random.color(),
    "#FFF",
    "upload"
  );
  const imageMd5 = Mock.Random.string("lower", 12);

  return {
    err_code: 0,
    error_msg: "",
    result: {
      image_url: imageUrl,
      image_md5: `image_md5_${imageMd5}`,
    },
  };
});
