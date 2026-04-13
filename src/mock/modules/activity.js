import Mock from "mockjs";

const headImgs = {
  1: require("@/assets/images/part/head-1.png"),
  2: require("@/assets/images/part/head-2.png"),
  3: require("@/assets/images/part/head-3.png"),
  4: require("@/assets/images/part/head-4.png"),
};
const bodyImgs = {
  1: require("@/assets/images/part/body-1.png"),
  2: require("@/assets/images/part/body-2.png"),
  3: require("@/assets/images/part/body-3.png"),
  4: require("@/assets/images/part/body-4.png"),
};
const weaponImgs = {
  1: require("@/assets/images/part/weapon-1.png"),
  2: require("@/assets/images/part/weapon-2.png"),
  3: require("@/assets/images/part/weapon-3.png"),
  4: require("@/assets/images/part/weapon-4.png"),
};

const generateImgs = [
  require("@/assets/images/generate/1-1-1.png"),
  require("@/assets/images/generate/1-2-3.png"),
  require("@/assets/images/generate/2-3-4.png"),
  require("@/assets/images/generate/3-1-2.png"),
  require("@/assets/images/generate/4-2-1.png"),
  require("@/assets/images/generate/4-4-4.png"),
];

const getGroupImage = (groupId) => {
  const imageId = Mock.Random.integer(1, 4);
  if (groupId === 1) return { image_id: imageId, image_url: headImgs[imageId] };
  if (groupId === 2) return { image_id: imageId, image_url: bodyImgs[imageId] };
  return { image_id: imageId, image_url: weaponImgs[imageId] };
};

// 2.1 查询用户信息接口

// 接口路径待补充，这里使用 /activity/api/open_api/v1/star_rail_mecha/detail 作为示例路径
Mock.mock(/\/activity\/api\/open_api\/v1\/star_rail_mecha\/detail/, "get", (options) => {
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
      "activity_id": 1001,
      "activity_status": 1,
      "poster_url": "",
      "groups": [
        {
          "group_id": 1,
          "group_status": Mock.Random.integer(1, 2),
          ...getGroupImage(1),
          "remain_refresh_count": Mock.Random.integer(0, 1),
        },
        {
          "group_id": 2,
          "group_status": Mock.Random.integer(0, 2),
          ...getGroupImage(2),
          "remain_refresh_count": Mock.Random.integer(0, 1),
        },
        {
          "group_id": 3,
          "group_status": 2,
          ...getGroupImage(3),
          "remain_refresh_count": Mock.Random.integer(0, 1),
        }
      ]

    },
  };
});

// 2.2 刷新部件接口
Mock.mock(/\/activity\/api\/open_api\/v1\/star_rail_mecha\/refresh/, "post", (options) => {
  const body = JSON.parse(options.body);
  const { activity_id, group_id } = body;

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
      ...getGroupImage(group_id || 1),
      "remain_refresh_count": Mock.Random.integer(0, 1),
    },
  };
});

// 2.3 合成机甲接口
Mock.mock(/\/activity\/api\/open_api\/v1\/star_rail_mecha\/synthesize/, "post", (options) => {
  const body = JSON.parse(options.body);
  const { activity_id } = body;
  // 如果活动不是进行中，返回错误
  if (activity_id !== 11011) {
    return {
      err_code: 1,
      error_msg: "活动不在进行中",
      result: null,
    };
  }
  return {
    err_code: 0,
    error_msg: "",
    result: {
      "poster_url": Mock.Random.pick(generateImgs),
     },
  };
});

// 2.4 获取昵称接口
Mock.mock(/\/activity\/api\/open_api\/v1\/up_account\/info/, "get", (options) => {
  return {
    err_code: 0,
    error_msg: "",
    result: {
      "mid": 0,
      "name": Mock.Random.cname(),
      "face": Mock.Random.image(),
    },
  };
});

// 2.5 上传图片接口
Mock.mock(/\/activity\/api\/open_api\/v1\/star_rail_mecha\/upload/, "post", (options) => {
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
