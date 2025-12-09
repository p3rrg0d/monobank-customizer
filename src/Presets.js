export const PRESETS = [
    {
        name: "Standard Dark (Стандарт)",
        state: {
            bgType: "solid",
            bgSolidColor: "#000000",
            bgSolidOpacity: 1,
            bgGradientString: "",
            bgGradientStops: [
                { id: 1, color: "#000000", opacity: 1, position: 0 },
                { id: 2, color: "#444444", opacity: 0.8, position: 100 }
            ],
            bgGradientAngle: 135,

            borderEnabled: false,
            borderStyle: "solid",
            borderWidth: 0,
            borderColor: "#000000",
            borderOpacity: 0,
            borderRadius: 16,

            progressRadius: 12,

            progTrackType: "gradient",
            progTrackSolidColor: "#e7b5d3",
            progTrackSolidOpacity: 1,
            progTrackGradientString: "",
            progTrackGradientStops: [
                { id: 1, color: "#e7b5d3", opacity: 1, position: 0 },
                { id: 2, color: "#eac6bb", opacity: 1, position: 100 }
            ],
            progTrackGradientAngle: 135,

            progFillType: "gradient",
            progFillSolidColor: "#b93e88",
            progFillSolidOpacity: 1,
            progFillGradientString: "",
            progFillGradientStops: [
                { id: 1, color: "#b93e88", opacity: 1, position: 0 },
                { id: 2, color: "#fca78c", opacity: 1, position: 100 }
            ],
            progFillGradientAngle: 135,

            textColor: "#ffffff",
            textShadowEnabled: false,
            textShadowColor: "#ff0000",
            textShadowOpacity: 1,
            textShadowX: 0,
            textShadowY: 2,
            textShadowBlur: 0,

            qrFrame: "standard"
        }
    },
    {
        name: "Clean White (Світлий)",
        state: {
            bgType: "solid",
            bgSolidColor: "#ffffff",
            bgSolidOpacity: 1,
            bgGradientString: "",
            bgGradientStops: [],
            bgGradientAngle: 0,

            borderEnabled: true,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#e0e0e0",
            borderOpacity: 1,
            borderRadius: 20,

            progressRadius: 8,

            progTrackType: "solid",
            progTrackSolidColor: "#f0f0f0",
            progTrackSolidOpacity: 1,
            progTrackGradientString: "",
            progTrackGradientStops: [],
            progTrackGradientAngle: 0,

            progFillType: "gradient",
            progFillSolidColor: "#e0e0e0",
            progFillSolidOpacity: 1,
            progFillGradientString: "linear-gradient(135deg, rgba(220, 220, 220, 1) 0%, rgba(200, 200, 200, 1) 100%)",
            progFillGradientStops: [
                { id: 1, color: "#dcdcdc", opacity: 1, position: 0 },
                { id: 2, color: "#c8c8c8", opacity: 1, position: 100 }
            ],
            progFillGradientAngle: 135,

            textColor: "#000000",
            textShadowEnabled: false,
            textShadowColor: "#000000",
            textShadowOpacity: 0,
            textShadowX: 0,
            textShadowY: 0,
            textShadowBlur: 0,

            qrFrame: "standard"
        }
    },
    {
        name: "Liquid Glass (Рідке Скло)",
        state: {
            bgType: "gradient",
            bgSolidColor: "#000000",
            bgSolidOpacity: 1,
            bgGradientString: "linear-gradient(37deg, rgba(136,136,136,0.19) 0%, rgba(164,164,164,0.32) 36%, rgba(136,136,136,0.03) 76%, rgba(164,164,164,0.53) 100%)",
            bgGradientStops: [
                { id: 1, color: "#888888", opacity: 0.19, position: 0 },
                { id: 2, color: "#a4a4a4", opacity: 0.32, position: 36 },
                { id: 3, color: "#888888", opacity: 0.03, position: 76 },
                { id: 4, color: "#a4a4a4", opacity: 0.53, position: 100 }
            ],
            bgGradientAngle: 37,

            borderEnabled: true,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#ffffff",
            borderOpacity: 0.15,
            borderRadius: 32,

            progressRadius: 12,

            progTrackType: "gradient",
            progTrackSolidColor: "#000000",
            progTrackSolidOpacity: 0,
            progTrackGradientString: "linear-gradient(180deg, rgba(0,0,0,0) 1%, rgba(0,0,0,0.22) 100%)",
            progTrackGradientStops: [
                { id: 1, color: "#000000", opacity: 0, position: 0 }, // 1% approximated to 0 for picker simplicity, or keep 1
                { id: 2, color: "#000000", opacity: 0.22, position: 100 }
            ],
            progTrackGradientAngle: 180,

            progFillType: "gradient",
            progFillSolidColor: "#acacac",
            progFillSolidOpacity: 1,
            progFillGradientString: "linear-gradient(177deg, rgba(172,172,172,1) 0%, rgba(83,131,142,1) 23%, rgba(83,179,183,1) 100%)",
            progFillGradientStops: [
                { id: 1, color: "#acacac", opacity: 1, position: 0 },
                { id: 2, color: "#53838e", opacity: 1, position: 23 },
                { id: 3, color: "#53b3b7", opacity: 1, position: 100 }
            ],
            progFillGradientAngle: 177,

            textColor: "#ffffff",
            textShadowEnabled: true,
            textShadowColor: "#6e6e6e",
            textShadowOpacity: 1,
            textShadowX: -1,
            textShadowY: 1,
            textShadowBlur: 2,

            qrFrame: "frame2"
        }
    },
    {
        name: "Sunset (Захід Сонця)",
        state: {
            bgType: "gradient",
            bgSolidColor: "#ee7752",
            bgSolidOpacity: 1,
            bgGradientString: "linear-gradient(135deg, rgba(238, 119, 82, 1) 0%, rgba(231, 60, 126, 1) 50%, rgba(35, 166, 213, 1) 100%)",
            bgGradientStops: [
                { id: 1, color: "#ee7752", opacity: 1, position: 0 },
                { id: 2, color: "#e73c7e", opacity: 1, position: 50 },
                { id: 3, color: "#23a6d5", opacity: 1, position: 100 }
            ],
            bgGradientAngle: 135,
            borderEnabled: false,
            borderStyle: "solid",
            borderWidth: 0,
            borderColor: "#ffffff",
            borderOpacity: 0,
            borderRadius: 24,
            progressRadius: 12,
            progTrackType: "solid",
            progTrackSolidColor: "#ffffff",
            progTrackSolidOpacity: 0.3,
            progTrackGradientString: "",
            progTrackGradientStops: [],
            progTrackGradientAngle: 0,
            progFillType: "gradient",
            progFillSolidColor: "#ffffff",
            progFillSolidOpacity: 1,
            progFillGradientString: "linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)",
            progFillGradientStops: [
                { id: 1, color: "#ffecd2", opacity: 1, position: 0 },
                { id: 2, color: "#fcb69f", opacity: 1, position: 100 }
            ],
            progFillGradientAngle: 90,
            textColor: "#ffffff",
            textShadowEnabled: true,
            textShadowColor: "#000000",
            textShadowOpacity: 0.2,
            textShadowX: 1,
            textShadowY: 1,
            textShadowBlur: 2,
            qrFrame: "frame2"
        }
    },
    {
        name: "Mint Fresh (Свіжа М'ята)",
        state: {
            bgType: "gradient",
            bgSolidColor: "#00b09b",
            bgSolidOpacity: 1,
            bgGradientString: "linear-gradient(45deg, #96fbc4 0%, #f9f586 100%)",
            bgGradientStops: [
                { id: 1, color: "#96fbc4", opacity: 1, position: 0 },
                { id: 2, color: "#f9f586", opacity: 1, position: 100 }
            ],
            bgGradientAngle: 45,
            borderEnabled: true,
            borderStyle: "solid",
            borderWidth: 4,
            borderColor: "#ffffff",
            borderOpacity: 0.8,
            borderRadius: 30,
            progressRadius: 15,
            progTrackType: "solid",
            progTrackSolidColor: "#000000",
            progTrackSolidOpacity: 0.1,
            progTrackGradientString: "",
            progTrackGradientStops: [],
            progTrackGradientAngle: 0,
            progFillType: "solid",
            progFillSolidColor: "#00b09b",
            progFillSolidOpacity: 1,
            progFillGradientString: "",
            progFillGradientStops: [],
            progFillGradientAngle: 0,
            textColor: "#2d5a4c",
            textShadowEnabled: false,
            textShadowColor: "#ffffff",
            textShadowOpacity: 1,
            textShadowX: 0,
            textShadowY: 0,
            textShadowBlur: 0,
            qrFrame: "frame2"
        }
    },
    {
        name: "Dark Luxury (Темний Люкс)",
        state: {
            bgType: "solid",
            bgSolidColor: "#1a1a1a",
            bgSolidOpacity: 1,
            bgGradientString: "",
            bgGradientStops: [],
            bgGradientAngle: 0,
            borderEnabled: true,
            borderStyle: "double",
            borderWidth: 3,
            borderColor: "#d4af37",
            borderOpacity: 1,
            borderRadius: 8,
            progressRadius: 2,
            progTrackType: "solid",
            progTrackSolidColor: "#333333",
            progTrackSolidOpacity: 1,
            progTrackGradientString: "",
            progTrackGradientStops: [],
            progTrackGradientAngle: 0,
            progFillType: "gradient",
            progFillSolidColor: "#d4af37",
            progFillSolidOpacity: 1,
            progFillGradientString: "linear-gradient(90deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)",
            progFillGradientStops: [
                { id: 1, color: "#bf953f", opacity: 1, position: 0 },
                { id: 2, color: "#fcf6ba", opacity: 1, position: 50 },
                { id: 3, color: "#b38728", opacity: 1, position: 100 }
            ],
            progFillGradientAngle: 90,
            textColor: "#d4af37",
            textShadowEnabled: false,
            textShadowColor: "#000000",
            textShadowOpacity: 0,
            textShadowX: 0,
            textShadowY: 0,
            textShadowBlur: 0,
            qrFrame: "standard"
        }
    },
    {
        name: "Neo Brutalism (Нео Бруталізм)",
        state: {
            bgType: "solid",
            bgSolidColor: "#ffcc00",
            bgSolidOpacity: 1,
            bgGradientString: "",
            bgGradientStops: [],
            bgGradientAngle: 0,
            borderEnabled: true,
            borderStyle: "solid",
            borderWidth: 4,
            borderColor: "#000000",
            borderOpacity: 1,
            borderRadius: 0,
            progressRadius: 0,
            progTrackType: "solid",
            progTrackSolidColor: "#ffffff",
            progTrackSolidOpacity: 1,
            progTrackGradientString: "",
            progTrackGradientStops: [],
            progTrackGradientAngle: 0,
            progFillType: "solid",
            progFillSolidColor: "#000000",
            progFillSolidOpacity: 1,
            progFillGradientString: "",
            progFillGradientStops: [],
            progFillGradientAngle: 0,
            textColor: "#000000",
            textShadowEnabled: true,
            textShadowColor: "#ffffff",
            textShadowOpacity: 1,
            textShadowX: 2,
            textShadowY: 2,
            textShadowBlur: 0,
            qrFrame: "frame2"
        }
    },
    {
        name: "Deep Space (Глибокий Космос)",
        state: {
            bgType: "gradient",
            bgSolidColor: "#0f2027",
            bgSolidOpacity: 1,
            bgGradientString: "linear-gradient(90deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
            bgGradientStops: [
                { id: 1, color: "#0f2027", opacity: 1, position: 0 },
                { id: 2, color: "#203a43", opacity: 1, position: 50 },
                { id: 3, color: "#2c5364", opacity: 1, position: 100 }
            ],
            bgGradientAngle: 90,
            borderEnabled: true,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#ffffff",
            borderOpacity: 0.2,
            borderRadius: 20,
            progressRadius: 10,
            progTrackType: "solid",
            progTrackSolidColor: "#ffffff",
            progTrackSolidOpacity: 0.1,
            progTrackGradientString: "",
            progTrackGradientStops: [],
            progTrackGradientAngle: 0,
            progFillType: "gradient",
            progFillSolidColor: "#00d2ff",
            progFillSolidOpacity: 1,
            progFillGradientString: "linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)",
            progFillGradientStops: [
                { id: 1, color: "#00d2ff", opacity: 1, position: 0 },
                { id: 2, color: "#3a7bd5", opacity: 1, position: 100 }
            ],
            progFillGradientAngle: 90,
            textColor: "#ffffff",
            textShadowEnabled: true,
            textShadowColor: "#00d2ff",
            textShadowOpacity: 0.5,
            textShadowX: 0,
            textShadowY: 0,
            textShadowBlur: 10,
            qrFrame: "frame2"
        }
    },
    {
        name: "Sunset (Захід Сонця)",
        state: {
            bgType: "gradient",
            bgSolidColor: "#ee7752",
            bgSolidOpacity: 1,
            bgGradientString: "linear-gradient(135deg, rgba(238, 119, 82, 1) 0%, rgba(231, 60, 126, 1) 50%, rgba(35, 166, 213, 1) 100%)",
            bgGradientStops: [
                { id: 1, color: "#ee7752", opacity: 1, position: 0 },
                { id: 2, color: "#e73c7e", opacity: 1, position: 50 },
                { id: 3, color: "#23a6d5", opacity: 1, position: 100 }
            ],
            bgGradientAngle: 135,
            borderEnabled: false,
            borderStyle: "solid",
            borderWidth: 0,
            borderColor: "#ffffff",
            borderOpacity: 0,
            borderRadius: 24,
            progressRadius: 12,
            progTrackType: "solid",
            progTrackSolidColor: "#ffffff",
            progTrackSolidOpacity: 0.3,
            progTrackGradientString: "",
            progTrackGradientStops: [],
            progTrackGradientAngle: 0,
            progFillType: "gradient",
            progFillSolidColor: "#ffffff",
            progFillSolidOpacity: 1,
            progFillGradientString: "linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)",
            progFillGradientStops: [
                { id: 1, color: "#ffecd2", opacity: 1, position: 0 },
                { id: 2, color: "#fcb69f", opacity: 1, position: 100 }
            ],
            progFillGradientAngle: 90,
            textColor: "#ffffff",
            textShadowEnabled: true,
            textShadowColor: "#000000",
            textShadowOpacity: 0.2,
            textShadowX: 1,
            textShadowY: 1,
            textShadowBlur: 2,
            qrFrame: "frame2"
        }
    },
    {
        name: "Transparent (Прозорий)",
        state: {
            bgType: "solid",
            bgSolidColor: "#ffffff",
            bgSolidOpacity: 0,
            bgGradientString: "",
            bgGradientStops: [],
            bgGradientAngle: 0,

            borderEnabled: false,
            borderStyle: "solid",
            borderWidth: 0,
            borderColor: "#ffffff",
            borderOpacity: 0,
            borderRadius: 32,

            progressRadius: 12,

            progTrackType: "solid",
            progTrackSolidColor: "#000000",
            progTrackSolidOpacity: 0,
            progTrackGradientString: "",
            progTrackGradientStops: [],
            progTrackGradientAngle: 0,

            progFillType: "gradient",
            progFillSolidColor: "#acacac",
            progFillSolidOpacity: 1,
            progFillGradientString: "linear-gradient(177deg, rgba(172,172,172,1) 0%, rgba(142,83,83,1) 23%, rgba(183,83,83,1) 100%)",
            progFillGradientStops: [
                { id: 1, color: "#acacac", opacity: 1, position: 0 },
                { id: 2, color: "#8e5353", opacity: 1, position: 23 },
                { id: 3, color: "#b75353", opacity: 1, position: 100 }
            ],
            progFillGradientAngle: 177,

            textColor: "#ffffff",
            textShadowEnabled: true,
            textShadowColor: "#6e6e6e",
            textShadowOpacity: 1,
            textShadowX: -1,
            textShadowY: 1,
            textShadowBlur: 2,

            qrFrame: "frame2"
        }
    }
];
