import { Preset } from "./types.ts";

export const PRESETS: Preset[] = [
  {
    name: "Standard Dark (Стандарт)",
    state: {
      background: {
        type: "solid",
        color: "#000000",
        opacity: 1,
        gradientString: "",
        gradientStops: [
          { id: 1, color: "#000000", opacity: 1, position: 0 },
          { id: 2, color: "#444444", opacity: 0.8, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: false,
        style: "solid",
        width: 0,
        color: "#000000",
        opacity: 0,
        radius: 16,
      },
      progress: {
        radius: 12,
        track: {
          type: "gradient",
          color: "#e7b5d3",
          opacity: 1,
          gradientString: "",
          gradientStops: [
            { id: 1, color: "#e7b5d3", opacity: 1, position: 0 },
            { id: 2, color: "#eac6bb", opacity: 1, position: 100 },
          ],
          gradientAngle: 135,
        },
        fill: {
          type: "gradient",
          color: "#b93e88",
          opacity: 1,
          gradientString: "",
          gradientStops: [
            { id: 1, color: "#b93e88", opacity: 1, position: 0 },
            { id: 2, color: "#fca78c", opacity: 1, position: 100 },
          ],
          gradientAngle: 135,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: false,
          color: "#ff0000",
          opacity: 1,
          x: 0,
          y: 2,
          blur: 0,
        },
      },
      qrFrame: "standard",
    },
  },

  {
    name: "Clean White (Світлий)",
    state: {
      background: {
        type: "solid",
        color: "#ffffff",
        opacity: 1,
        gradientString: "",
        gradientStops: [],
        gradientAngle: 0,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#e0e0e0",
        opacity: 1,
        radius: 20,
      },
      progress: {
        radius: 8,
        track: {
          type: "solid",
          color: "#f0f0f0",
          opacity: 1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#e0e0e0",
          opacity: 1,
          gradientString:
            "linear-gradient(135deg, rgba(220, 220, 220, 1) 0%, rgba(200, 200, 200, 1) 100%)",
          gradientStops: [
            { id: 1, color: "#dcdcdc", opacity: 1, position: 0 },
            { id: 2, color: "#c8c8c8", opacity: 1, position: 100 },
          ],
          gradientAngle: 135,
        },
      },
      text: {
        color: "#000000",
        shadow: {
          enabled: false,
          color: "#000000",
          opacity: 0,
          x: 0,
          y: 0,
          blur: 0,
        },
      },
      qrFrame: "frame3",
    },
  },

  {
    name: "Minimal Grey (Мінімал)",
    state: {
      background: {
        type: "solid",
        color: "#f5f5f5",
        opacity: 0.4,
        gradientString: "",
        gradientStops: [],
        gradientAngle: 0,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#e0e0e0",
        opacity: 1,
        radius: 12,
      },
      progress: {
        radius: 6,
        track: {
          type: "solid",
          color: "#eeeeee",
          opacity: 1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "solid",
          color: "#333333",
          opacity: 1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: false,
          color: "#000000",
          opacity: 0,
          x: 0,
          y: 0,
          blur: 0,
        },
      },
      qrFrame: "frame3",
    },
  },

  {
    name: "Glassmorphism (Скляний)",
    state: {
      background: {
        type: "solid",
        color: "#ffffff",
        opacity: 0.05,
        gradientString: "",
        gradientStops: [],
        gradientAngle: 0,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#ffffff",
        opacity: 0.1,
        radius: 40,
      },
      progress: {
        radius: 20,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.5,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.2,
          x: 0,
          y: 2,
          blur: 4,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Transparent (Прозорий)",
    state: {
      background: {
        type: "solid",
        color: "#ffffff",
        opacity: 0,
        gradientString: "",
        gradientStops: [],
        gradientAngle: 0,
      },
      border: {
        enabled: false,
        style: "solid",
        width: 0,
        color: "#ffffff",
        opacity: 0,
        radius: 32,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#000000",
          opacity: 0,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#acacac",
          opacity: 1,
          gradientString:
            "linear-gradient(177deg, rgba(172,172,172,1) 0%, rgba(142,83,83,1) 23%, rgba(183,83,83,1) 100%)",
          gradientStops: [
            { id: 1, color: "#acacac", opacity: 1, position: 0 },
            { id: 2, color: "#8e5353", opacity: 1, position: 23 },
            { id: 3, color: "#b75353", opacity: 1, position: 100 },
          ],
          gradientAngle: 177,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#6e6e6e",
          opacity: 1,
          x: -1,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Candy Cane (Льодяник)",
    state: {
      background: {
        type: "gradient",
        color: "#ffffff",
        opacity: 0.4,
        gradientString:
          "linear-gradient(45deg, rgba(255, 255, 255, 0.4) 25%, rgba(255, 0, 0, 0.4) 25%, rgba(255, 0, 0, 0.4) 50%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.4) 75%, rgba(255, 0, 0, 0.4) 75%, rgba(255, 0, 0, 0.4) 100%)",
        gradientStops: [
          { id: 1, color: "#ffffff", opacity: 0.4, position: 25 },
          { id: 2, color: "#ff0000", opacity: 0.4, position: 25 },
          { id: 3, color: "#ff0000", opacity: 0.4, position: 50 },
          { id: 4, color: "#ffffff", opacity: 0.4, position: 50 },
          { id: 5, color: "#ffffff", opacity: 0.4, position: 75 },
          { id: 6, color: "#ff0000", opacity: 0.4, position: 75 },
          { id: 7, color: "#ff0000", opacity: 0.4, position: 100 },
        ],
        gradientAngle: 45,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 4,
        color: "#ff0000",
        opacity: 1,
        radius: 20,
      },
      progress: {
        radius: 10,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.8,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "solid",
          color: "#ff0000",
          opacity: 1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.3,
          x: 1,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Lava (Лава)",
    state: {
      background: {
        type: "gradient",
        color: "#000000",
        opacity: 0.4,
        gradientString:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(67, 67, 67, 0.4) 100%)",
        gradientStops: [
          { id: 1, color: "#000000", opacity: 0.4, position: 0 },
          { id: 2, color: "#434343", opacity: 0.4, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#ff4b2b",
        opacity: 0.5,
        radius: 20,
      },
      progress: {
        radius: 10,
        track: {
          type: "solid",
          color: "#000000",
          opacity: 0.5,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#ff4b2b",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #ff4b2b 0%, #ff416c 100%)",
          gradientStops: [
            { id: 1, color: "#ff4b2b", opacity: 1, position: 0 },
            { id: 2, color: "#ff416c", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#ff4b2b",
          opacity: 1,
          x: 0,
          y: 1,
          blur: 4,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Christmas (Різдвяний)",
    state: {
      background: {
        type: "gradient",
        color: "#d32f2f",
        opacity: 1,
        gradientString:
          "linear-gradient(135deg, rgba(211,47,47,1) 6%, rgba(27,94,32,1) 27%, rgba(211,47,47,1) 47%, rgba(27,94,32,1) 67%, rgba(211,47,47,1) 85%, rgba(27,94,32,1) 100%)",
        gradientStops: [
          { id: 1, color: "#d32f2f", opacity: 1, position: 6 },
          { id: 2, color: "#1b5e20", opacity: 1, position: 27 },
          { id: 3, color: "#d32f2f", opacity: 1, position: 47 },
          { id: 4, color: "#1b5e20", opacity: 1, position: 67 },
          { id: 5, color: "#d32f2f", opacity: 1, position: 85 },
          { id: 6, color: "#1b5e20", opacity: 1, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 2,
        color: "#e6b559",
        opacity: 1,
        radius: 24,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.2,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#e6b559",
          opacity: 1,
          gradientString:
            "linear-gradient(90deg, rgba(230,181,89,1) 0%, rgba(221,197,153,1) 100%)",
          gradientStops: [
            { id: 1, color: "#e6b559", opacity: 1, position: 0 },
            { id: 2, color: "#ddc599", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.5,
          x: 1,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Vibrant Orange (Драйв)",
    state: {
      background: {
        type: "gradient",
        color: "#ff4e50",
        opacity: 0.4,
        gradientString:
          "linear-gradient(135deg, rgba(255, 78, 80, 0.4) 0%, rgba(249, 212, 35, 0.4) 100%)",
        gradientStops: [
          { id: 1, color: "#ff4e50", opacity: 0.4, position: 0 },
          { id: 2, color: "#f9d423", opacity: 0.4, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: false,
        style: "solid",
        width: 0,
        color: "#ffffff",
        opacity: 0,
        radius: 24,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.2,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.9,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
      },
      text: {
        color: "#5A2020",
        shadow: {
          enabled: true,
          color: "#ff4e50",
          opacity: 0.5,
          x: 0,
          y: 2,
          blur: 4,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Sunset (Захід Сонця)",
    state: {
      background: {
        type: "gradient",
        color: "#ee7752",
        opacity: 1,
        gradientString:
          "linear-gradient(135deg, rgba(238, 119, 82, 1) 0%, rgba(231, 60, 126, 1) 50%, rgba(35, 166, 213, 1) 100%)",
        gradientStops: [
          { id: 1, color: "#ee7752", opacity: 1, position: 0 },
          { id: 2, color: "#e73c7e", opacity: 1, position: 50 },
          { id: 3, color: "#23a6d5", opacity: 1, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: false,
        style: "solid",
        width: 0,
        color: "#ffffff",
        opacity: 0,
        radius: 24,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.3,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#ffffff",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)",
          gradientStops: [
            { id: 1, color: "#ffecd2", opacity: 1, position: 0 },
            { id: 2, color: "#fcb69f", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.2,
          x: 1,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Autumn (Осінь)",
    state: {
      background: {
        type: "gradient",
        color: "#d84315",
        opacity: 0.4,
        gradientString:
          "linear-gradient(135deg, rgba(191, 54, 12, 0.4) 0%, rgba(255, 112, 67, 0.4) 100%)",
        gradientStops: [
          { id: 1, color: "#bf360c", opacity: 0.4, position: 0 },
          { id: 2, color: "#ff7043", opacity: 0.4, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#ffab91",
        opacity: 0.6,
        radius: 24,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.2,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#ff8f00",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #ff8f00 0%, #ffca28 100%)",
          gradientStops: [
            { id: 1, color: "#ff8f00", opacity: 1, position: 0 },
            { id: 2, color: "#ffca28", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#fff8e1",
        shadow: {
          enabled: true,
          color: "#bf360c",
          opacity: 0.6,
          x: 1,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Coffee (Кавовий)",
    state: {
      background: {
        type: "gradient",
        color: "#3e2723",
        opacity: 1,
        gradientString:
          "linear-gradient(135deg, rgba(62,39,35,1) 0%, rgba(109,76,65,1) 100%)",
        gradientStops: [
          { id: 1, color: "#3e2723", opacity: 1, position: 0 },
          { id: 2, color: "#6d4c41", opacity: 1, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: false,
        style: "solid",
        width: 0,
        color: "#d7ccc8",
        opacity: 1,
        radius: 20,
      },
      progress: {
        radius: 10,
        track: {
          type: "solid",
          color: "#d7ccc8",
          opacity: 0.2,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#90817b",
          opacity: 0.39,
          gradientString:
            "linear-gradient(90deg, rgba(144,129,123,0.39) 0%, rgba(239,235,233,0.53) 98%)",
          gradientStops: [
            { id: 1, color: "#90817b", opacity: 0.39, position: 0 },
            { id: 2, color: "#efebe9", opacity: 0.53, position: 98 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#efebe9",
        shadow: {
          enabled: false,
          color: "#000000",
          opacity: 0,
          x: 0,
          y: 0,
          blur: 0,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Midnight Gold (Золото)",
    state: {
      background: {
        type: "gradient",
        color: "#0f0c29",
        opacity: 0.4,
        gradientString:
          "linear-gradient(135deg, rgba(15, 12, 41, 0.4) 0%, rgba(48, 43, 99, 0.4) 50%, rgba(36, 36, 62, 0.4) 100%)",
        gradientStops: [
          { id: 1, color: "#0f0c29", opacity: 0.4, position: 0 },
          { id: 2, color: "#302b63", opacity: 0.4, position: 50 },
          { id: 3, color: "#24243e", opacity: 0.4, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#d4af37",
        opacity: 0.8,
        radius: 16,
      },
      progress: {
        radius: 8,
        track: {
          type: "solid",
          color: "#000000",
          opacity: 0.2,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#ffd700",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #d4af37 0%, #ffd700 100%)",
          gradientStops: [
            { id: 1, color: "#d4af37", opacity: 1, position: 0 },
            { id: 2, color: "#ffd700", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#ffd700",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.5,
          x: 0,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Mint Fresh (Свіжа М'ята)",
    state: {
      background: {
        type: "gradient",
        color: "#84fab0",
        opacity: 1,
        gradientString: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
        gradientStops: [
          { id: 1, color: "#84fab0", opacity: 1, position: 0 },
          { id: 2, color: "#8fd3f4", opacity: 1, position: 100 },
        ],
        gradientAngle: 120,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 2,
        color: "#ffffff",
        opacity: 0.6,
        radius: 24,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.4,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#009688",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #0ba360 0%, #3cba92 100%)",
          gradientStops: [
            { id: 1, color: "#0ba360", opacity: 1, position: 0 },
            { id: 2, color: "#3cba92", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#004d40",
        shadow: {
          enabled: false,
          color: "#ffffff",
          opacity: 1,
          x: 0,
          y: 0,
          blur: 0,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Forest (Ліс)",
    state: {
      background: {
        type: "gradient",
        color: "#1b5e20",
        opacity: 1,
        gradientString:
          "linear-gradient(135deg, rgba(27,94,32,0.85) 0%, rgba(56,142,60,0.85) 100%)",
        gradientStops: [
          { id: 1, color: "#1b5e20", opacity: 0.85, position: 0 },
          { id: 2, color: "#388e3c", opacity: 0.85, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#81c784",
        opacity: 0.4,
        radius: 20,
      },
      progress: {
        radius: 10,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.15,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#4caf50",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #66bb6a 0%, #a5d6a7 100%)",
          gradientStops: [
            { id: 1, color: "#66bb6a", opacity: 1, position: 0 },
            { id: 2, color: "#a5d6a7", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#e8f5e9",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.5,
          x: 1,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Nature Moss (Мох)",
    state: {
      background: {
        type: "gradient",
        color: "#1a2421",
        opacity: 0.4,
        gradientString:
          "linear-gradient(135deg, rgba(26, 36, 33, 0.4) 0%, rgba(61, 43, 31, 0.4) 100%)",
        gradientStops: [
          { id: 1, color: "#1a2421", opacity: 0.4, position: 0 },
          { id: 2, color: "#3d2b1f", opacity: 0.4, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 2,
        color: "#4a5d23",
        opacity: 0.8,
        radius: 20,
      },
      progress: {
        radius: 10,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.05,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#4a5d23",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #4a5d23 0%, #7d8c4d 100%)",
          gradientStops: [
            { id: 1, color: "#4a5d23", opacity: 1, position: 0 },
            { id: 2, color: "#7d8c4d", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#e9edc9",
        shadow: {
          enabled: true,
          color: "#1a2421",
          opacity: 0.6,
          x: 1,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Terminal (Термінал)",
    state: {
      background: {
        type: "solid",
        color: "#000000",
        opacity: 1,
        gradientString: "",
        gradientStops: [],
        gradientAngle: 0,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 2,
        color: "#39ff14",
        opacity: 1,
        radius: 0,
      },
      progress: {
        radius: 0,
        track: {
          type: "solid",
          color: "#111111",
          opacity: 1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "solid",
          color: "#006400",
          opacity: 1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
      },
      text: {
        color: "#39ff14",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 1,
          x: 1,
          y: 1,
          blur: 0,
        },
      },
      qrFrame: "standard",
    },
  },

  {
    name: "Patriotic (Патріотичний)",
    state: {
      background: {
        type: "gradient",
        color: "#0057b7",
        opacity: 1,
        gradientString:
          "linear-gradient(180deg, rgba(0,87,183,1) 0%, rgba(0,87,183,1) 50%, rgba(136,136,136,1) 50%, rgba(255,215,0,1) 51%, rgba(255,215,0,1) 100%)",
        gradientStops: [
          { id: 1, color: "#0057b7", opacity: 1, position: 0 },
          { id: 2, color: "#0057b7", opacity: 1, position: 50 },
          { id: 3, color: "#888888", opacity: 1, position: 50 },
          { id: 4, color: "#ffd700", opacity: 1, position: 51 },
          { id: 5, color: "#ffd700", opacity: 1, position: 100 },
        ],
        gradientAngle: 180,
      },
      border: {
        enabled: false,
        style: "solid",
        width: 0,
        color: "#ffffff",
        opacity: 0.8,
        radius: 24,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#494949",
          opacity: 0.33,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "solid",
          color: "#828282",
          opacity: 1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.5,
          x: 1,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "standard",
    },
  },

  {
    name: "Deep Space (Глибокий Космос)",
    state: {
      background: {
        type: "gradient",
        color: "#0b0c15",
        opacity: 1,
        gradientString:
          "linear-gradient(135deg, #0b0c15 0%, #141726 50%, #201c38 100%)",
        gradientStops: [
          { id: 1, color: "#0b0c15", opacity: 1, position: 0 },
          { id: 2, color: "#141726", opacity: 1, position: 50 },
          { id: 3, color: "#201c38", opacity: 1, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#ffffff",
        opacity: 0.1,
        radius: 32,
      },
      progress: {
        radius: 16,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.05,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#7b2ff7",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #7b2ff7 0%, #2f7ff7 100%)",
          gradientStops: [
            { id: 1, color: "#7b2ff7", opacity: 1, position: 0 },
            { id: 2, color: "#2f7ff7", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#7b2ff7",
          opacity: 0.6,
          x: 0,
          y: 0,
          blur: 8,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Royal Velvet (Оксамит)",
    state: {
      background: {
        type: "gradient",
        color: "#4b0082",
        opacity: 0.4,
        gradientString:
          "linear-gradient(135deg, rgba(75, 0, 130, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%)",
        gradientStops: [
          { id: 1, color: "#4b0082", opacity: 0.4, position: 0 },
          { id: 2, color: "#000000", opacity: 0.4, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#c0c0c0",
        opacity: 0.4,
        radius: 24,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "solid",
          color: "#9370db",
          opacity: 1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
      },
      text: {
        color: "#e6e6fa",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.8,
          x: 0,
          y: 2,
          blur: 4,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Cotton Candy (Цукрова Вата)",
    state: {
      background: {
        type: "gradient",
        color: "#ff9a9e",
        opacity: 1,
        gradientString: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        gradientStops: [
          { id: 1, color: "#a18cd1", opacity: 1, position: 0 },
          { id: 2, color: "#fbc2eb", opacity: 1, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: false,
        style: "solid",
        width: 0,
        color: "#ffffff",
        opacity: 0,
        radius: 30,
      },
      progress: {
        radius: 15,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.3,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#ffffff",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #fdcbf1 0%, #e6dee9 100%)",
          gradientStops: [
            { id: 1, color: "#fdcbf1", opacity: 1, position: 0 },
            { id: 2, color: "#e6dee9", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#a18cd1",
          opacity: 0.5,
          x: 1,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Sunset Rose (Троянда)",
    state: {
      background: {
        type: "gradient",
        color: "#f093fb",
        opacity: 0.4,
        gradientString:
          "linear-gradient(120deg, rgba(240, 147, 251, 0.4) 0%, rgba(245, 87, 108, 0.4) 100%)",
        gradientStops: [
          { id: 1, color: "#f093fb", opacity: 0.4, position: 0 },
          { id: 2, color: "#f5576c", opacity: 0.4, position: 100 },
        ],
        gradientAngle: 120,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#ffffff",
        opacity: 0.5,
        radius: 24,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.3,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "solid",
          color: "#f5576c",
          opacity: 1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.2,
          x: 0,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Sakura (Сакура)",
    state: {
      background: {
        type: "gradient",
        color: "#ffcdd2",
        opacity: 1,
        gradientString:
          "linear-gradient(135deg, rgba(255,205,210,0.85) 0%, rgba(255,148,194,0.85) 100%)",
        gradientStops: [
          { id: 1, color: "#ffcdd2", opacity: 0.85, position: 0 },
          { id: 2, color: "#ff94c2", opacity: 0.85, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#ffffff",
        opacity: 0.6,
        radius: 24,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.4,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#e91e63",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #f48fb1 0%, #e91e63 100%)",
          gradientStops: [
            { id: 1, color: "#f48fb1", opacity: 1, position: 0 },
            { id: 2, color: "#e91e63", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#4a042a",
        shadow: {
          enabled: true,
          color: "#ffffff",
          opacity: 0.8,
          x: 0,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame3",
    },
  },

  {
    name: "Barbie (Барбі)",
    state: {
      background: {
        type: "gradient",
        color: "#ff00a0",
        opacity: 1,
        gradientString:
          "linear-gradient(135deg, rgba(255,0,160,0.8) 0%, rgba(255,105,180,0.8) 100%)",
        gradientStops: [
          { id: 1, color: "#ff00a0", opacity: 0.8, position: 0 },
          { id: 2, color: "#ff69b4", opacity: 0.8, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "dashed",
        width: 2,
        color: "#ffffff",
        opacity: 0.9,
        radius: 30,
      },
      progress: {
        radius: 15,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.4,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#ffffff",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #ffffff 0%, #ffcce6 100%)",
          gradientStops: [
            { id: 1, color: "#ffffff", opacity: 1, position: 0 },
            { id: 2, color: "#ffcce6", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#ff00a0",
          opacity: 0.8,
          x: 1,
          y: 1,
          blur: 0,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Pastel (Пастель)",
    state: {
      background: {
        type: "gradient",
        color: "#ff9a9e",
        opacity: 0.4,
        gradientString:
          "linear-gradient(135deg, rgba(255, 154, 158, 0.4) 0%, rgba(250, 208, 196, 0.4) 100%)",
        gradientStops: [
          { id: 1, color: "#ff9a9e", opacity: 0.4, position: 0 },
          { id: 2, color: "#fad0c4", opacity: 0.4, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 3,
        color: "#ffffff",
        opacity: 1,
        radius: 30,
      },
      progress: {
        radius: 15,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.5,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "solid",
          color: "#fbc2eb",
          opacity: 1,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
      },
      text: {
        color: "#666",
        shadow: {
          enabled: true,
          color: "#ffffff",
          opacity: 1,
          x: 0,
          y: 0,
          blur: 4,
        },
      },
      qrFrame: "frame3",
    },
  },

  {
    name: "Dark Luxury (Темний Люкс)",
    state: {
      background: {
        type: "gradient",
        color: "#1a1a1a",
        opacity: 1,
        gradientString: "linear-gradient(135deg, #000000 0%, #2c2c2c 100%)",
        gradientStops: [
          { id: 1, color: "#000000", opacity: 1, position: 0 },
          { id: 2, color: "#2c2c2c", opacity: 1, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#d4af37",
        opacity: 0.6,
        radius: 24,
      },
      progress: {
        radius: 12,
        track: {
          type: "solid",
          color: "#000000",
          opacity: 0.4,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#d4af37",
          opacity: 1,
          gradientString:
            "linear-gradient(90deg, #ae8b3c 0%, #fcf6ba 50%, #ae8b3c 100%)",
          gradientStops: [
            { id: 1, color: "#ae8b3c", opacity: 1, position: 0 },
            { id: 2, color: "#fcf6ba", opacity: 1, position: 50 },
            { id: 3, color: "#ae8b3c", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#f2eecb",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.8,
          x: 0,
          y: 2,
          blur: 4,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Liquid Glass (Рідке Скло)",
    state: {
      background: {
        type: "gradient",
        color: "#000000",
        opacity: 1,
        gradientString:
          "linear-gradient(37deg, rgba(136,136,136,0.19) 0%, rgba(164,164,164,0.32) 36%, rgba(136,136,136,0.03) 76%, rgba(164,164,164,0.53) 100%)",
        gradientStops: [
          { id: 1, color: "#888888", opacity: 0.19, position: 0 },
          { id: 2, color: "#a4a4a4", opacity: 0.32, position: 36 },
          { id: 3, color: "#888888", opacity: 0.03, position: 76 },
          { id: 4, color: "#a4a4a4", opacity: 0.53, position: 100 },
        ],
        gradientAngle: 37,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 1,
        color: "#ffffff",
        opacity: 0.15,
        radius: 32,
      },
      progress: {
        radius: 12,
        track: {
          type: "gradient",
          color: "#000000",
          opacity: 0,
          gradientString:
            "linear-gradient(180deg, rgba(0,0,0,0) 1%, rgba(0,0,0,0.22) 100%)",
          gradientStops: [
            { id: 1, color: "#000000", opacity: 0, position: 0 },
            { id: 2, color: "#000000", opacity: 0.22, position: 100 },
          ],
          gradientAngle: 180,
        },
        fill: {
          type: "gradient",
          color: "#acacac",
          opacity: 1,
          gradientString:
            "linear-gradient(177deg, rgba(172,172,172,1) 0%, rgba(83,131,142,1) 23%, rgba(83,179,183,1) 100%)",
          gradientStops: [
            { id: 1, color: "#acacac", opacity: 1, position: 0 },
            { id: 2, color: "#53838e", opacity: 1, position: 23 },
            { id: 3, color: "#53b3b7", opacity: 1, position: 100 },
          ],
          gradientAngle: 177,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#6e6e6e",
          opacity: 1,
          x: -1,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "frame2",
    },
  },

  {
    name: "Monochrome (Монохром)",
    state: {
      background: {
        type: "gradient",
        color: "#000000",
        opacity: 0.9,
        gradientString:
          "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(60,60,60,0.9) 100%)",
        gradientStops: [
          { id: 1, color: "#000000", opacity: 0.9, position: 0 },
          { id: 2, color: "#3c3c3c", opacity: 0.9, position: 100 },
        ],
        gradientAngle: 135,
      },
      border: {
        enabled: true,
        style: "solid",
        width: 2,
        color: "#ffffff",
        opacity: 0.8,
        radius: 16,
      },
      progress: {
        radius: 8,
        track: {
          type: "solid",
          color: "#ffffff",
          opacity: 0.2,
          gradientString: "",
          gradientStops: [],
          gradientAngle: 0,
        },
        fill: {
          type: "gradient",
          color: "#ffffff",
          opacity: 1,
          gradientString: "linear-gradient(90deg, #999999 0%, #ffffff 100%)",
          gradientStops: [
            { id: 1, color: "#999999", opacity: 1, position: 0 },
            { id: 2, color: "#ffffff", opacity: 1, position: 100 },
          ],
          gradientAngle: 90,
        },
      },
      text: {
        color: "#ffffff",
        shadow: {
          enabled: true,
          color: "#000000",
          opacity: 0.5,
          x: 0,
          y: 1,
          blur: 2,
        },
      },
      qrFrame: "standard",
    },
  },
];
