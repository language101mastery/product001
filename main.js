// 1. Data
const hanjaData = [
  { hanja: '愛', chineseT: '愛', chineseS: '爱', japanese: '愛', huneum: '사랑 애', meaning: '사랑' },
  { hanja: '信', chineseT: '信', chineseS: '信', japanese: '信', huneum: '믿을 신', meaning: '믿음' },
  { hanja: '仁', chineseT: '仁', chineseS: '仁', japanese: '仁', huneum: '어질 인', meaning: '어짊' },
  { hanja: '義', chineseT: '義', chineseS: '义', japanese: '義', huneum: '옳을 의', meaning: '의로움' },
  { hanja: '禮', chineseT: '禮', chineseS: '礼', japanese: '礼', huneum: '예절 례', meaning: '예절' },
  { hanja: '智', chineseT: '智', chineseS: '智', japanese: '智', huneum: '지혜 지', meaning: '지혜' },
  { hanja: '學', chineseT: '學', chineseS: '学', japanese: '学', huneum: '배울 학', meaning: '배움' },
  { hanja: '敎', chineseT: '教', chineseS: '教', japanese: '教', huneum: '가르칠 교', meaning: '가르침' }
];

const cheonjamunData = [
  "天地玄黃 宇宙洪荒", "日月盈昃 辰宿列張", "寒來暑往 秋收冬藏", "閏餘成歲 律呂調陽",
  "雲騰致雨 露結爲霜", "金生麗水 玉出崑岡", "劍號巨闕 珠稱夜光", "果珍李柰 菜重芥薑",
  "海鹹河淡 鱗潛羽翔", "龍師火帝 鳥官人皇", "始制文字 乃服衣裳", "推位讓國 有虞陶唐",
  "弔民伐罪 周發殷湯", "坐朝問道 垂拱平章", "愛育黎首 臣伏戎羌", "遐邇壹體 率賓歸王",
  "鳴鳳在樹 白駒食場", "化被草木 賴及萬方", "蓋此身髮 四大五常", "恭惟鞠養 豈敢毁傷",
  "女慕貞烈 男效才良", "知過必改 得能莫忘", "罔談彼短 靡恃己長", "信使可覆 器欲難量",
  "墨悲絲染 詩讚羔羊", "景行維賢 克念作聖", "德建名立 形端表正", "空谷傳聲 虛堂習聽",
  "禍因惡積 福緣善慶", "尺璧非寶 寸陰是競", "資父事君 曰嚴與敬", "孝當竭力 忠則盡命",
  "臨深履薄 夙興溫凊", "似蘭斯馨 如松之盛", "川流不息 淵澄取暎", "容止若思 言辭安定",
  "篤初誠美 愼終宜令", "榮業所基 籍甚無竟", "學優登仕 攝職從政", "存以甘棠 去而益詠",
  "樂殊貴賤 禮別尊卑", "上和下睦 夫唱婦隨", "外受傅訓 入奉母儀", "諸姑伯叔 猶子比兒",
  "孔懷兄弟 同氣連枝", "交友投分 切磨箴規", "仁慈隱惻 造次弗離", "節義廉退 顚沛匪虧",
  "性靜情逸 心動神疲", "守眞志滿 逐物意移", "堅持雅操 好爵自縻", "都邑華夏 東西二京",
  "背邙面洛 浮渭據涇", "宮殿盤鬱 樓觀飛驚", "圖寫禽獸 畵采仙靈", "丙舍傍啓 甲帳對楹",
  "肆筵設席 鼓瑟吹笙", "陞階納陛 弁轉疑星", "右通廣內 左達承明", "旣集墳典 亦聚群英",
  "杜稿鍾隸 漆書壁經", "府羅將相 路夾槐卿", "戶封八縣 家給千兵", "高冠陪輦 驅轂振纓",
  "世祿侈富 車駕肥輕", "策功茂實 勒碑刻銘", "磻溪伊尹 佐時阿衡", "奄宅曲阜 微旦孰營",
  "桓公匡合 濟弱扶傾", "綺回漢惠 說感武丁", "俊乂密勿 多士寔寧", "晋楚更覇 趙魏困橫",
  "假途滅虢 踐土會盟", "何遵約法 韓弊煩刑", "起翦頗牧 用軍最精", "宣威沙漠 馳譽丹靑",
  "九州禹跡 百郡秦幷", "嶽宗恒岱 禪主云亭", "雁門紫塞 鷄田赤城", "昆池碣石 鉅野洞庭",
  "曠遠綿邈 巖峀杳冥", "治本於農 務玆稼穡", "俶載南畝 我藝黍稷", "稅熟貢新 勸賞黜陟",
  "孟軻敦素 史魚秉直", "庶幾中庸 勞謙謹勅", "聆音察理 鑑貌辨色", "貽厥嘉猷 勉其祗植",
  "省躬譏誡 寵增抗極", "殆辱近恥 林皐幸卽", "兩疏見機 解組誰逼", "索居閑處 沈黙寂寥",
  "求古尋論 散慮逍遙", "欣奏累遣 慼謝歡招", "渠荷的歷 園莽抽條", "枇杷晩翠 梧桐早凋",
  "陳根委翳 落葉飄颻", "遊鵾獨運 凌摩絳霄", "耽讀翫市 寓目囊箱", "易輶攸畏 屬耳垣牆",
  "具膳飱飯 適口充腸", "飽飫烹宰 饑厭糟糠", "親戚故舊 老少異糧", "妾御績紡 侍巾帷房",
  "紈扇圓潔 銀燭煒煌", "晝眠夕寐 藍筍象床", "弦歌酒讌 接杯擧觴", "矯手頓足 悅豫且康",
  "嫡後嗣續 祭祀蒸嘗", "稽顙再拜 悚懼恐惶", "牋牒簡要 顧答審詳", "骸垢想浴 執熱願凉",
  "驢騾犢特 駭躍超驤", "誅斬賊盜 捕獲叛亡", "布射僚丸 嵇琴阮嘯", "恬筆倫紙 鈞巧任釣",
  "釋紛利俗 竝皆佳妙", "毛施淑姿 工顰姸笑", "年矢每催 曦暉朗耀", "璇璣懸斡 晦魄環照",
  "指薪修祐 永綏吉劭", "矩步引領 俯仰廊廟", "束帶矜莊 徘徊瞻眺", "孤陋寡聞 愚蒙等誚",
  "謂語助者 焉哉乎也"
];

// 2. State Management
let currentIndex = 0;
let currentCharset = 'hanja'; // e.g., 'hanja', 'chineseT', 'chineseS', 'japanese', 'cheonjamun'

// 3. Web Component: <hanja-card>
class HanjaCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--card-background, #ffffff);
          border-radius: 15px;
          padding: 2.5rem;
          min-height: 350px;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0,0,0,0.05);
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
        }
        .character {
          font-family: var(--hanja-font, 'Noto Serif KR', serif);
          font-size: 8rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          line-height: 1;
        }
        .details {
          margin-top: 2rem;
        }
        .huneum {
          font-family: var(--main-font, 'Orbitron', sans-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: #444;
        }
        .meaning {
          margin-top: 0.75rem;
          font-family: var(--main-font, 'Orbitron', sans-serif);
          font-size: 1.1rem;
          color: #666;
        }
      </style>
      <div class="character"></div>
      <div class="details">
        <div class="huneum"></div>
        <div class="meaning"></div>
      </div>
    `;
  }

  update(data, charset) {
    if (data) {
      const character = data[charset] || data['hanja'];
      this.shadowRoot.querySelector('.character').textContent = character;
      this.shadowRoot.querySelector('.huneum').textContent = data.huneum;
      this.shadowRoot.querySelector('.meaning').textContent = data.meaning;
    }
  }
}
customElements.define('hanja-card', HanjaCard);

// 4. Application Logic
document.addEventListener('DOMContentLoaded', () => {
    const hanjaCard = document.querySelector('hanja-card');
    const cheonjamunContainer = document.getElementById('cheonjamun-container');
    const navigation = document.querySelector('.navigation');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const charsetButtons = document.querySelectorAll('.char-set-selector button');

    function renderCheonjamun() {
      cheonjamunContainer.innerHTML = '';
      cheonjamunData.forEach(phrase => {
        const p = document.createElement('p');
        p.textContent = phrase;
        cheonjamunContainer.appendChild(p);
      });
    }

    function showHanja(index) {
        if (!hanjaCard) return;
        hanjaCard.style.opacity = '0';
        hanjaCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            hanjaCard.update(hanjaData[index], currentCharset);
            hanjaCard.style.opacity = '1';
            hanjaCard.style.transform = 'scale(1)';
        }, 200);
    }

    function setMode(mode) {
      currentCharset = mode;
      charsetButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelector(`[data-charset='${mode}']`).classList.add('active');

      if (mode === 'cheonjamun') {
        hanjaCard.style.display = 'none';
        navigation.style.display = 'none';
        cheonjamunContainer.style.display = 'block';
        if (cheonjamunContainer.children.length === 0) { // Render only once
          renderCheonjamun();
        }
      } else {
        hanjaCard.style.display = 'flex';
        navigation.style.display = 'flex';
        cheonjamunContainer.style.display = 'none';
        showHanja(currentIndex);
      }
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + hanjaData.length) % hanjaData.length;
        showHanja(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % hanjaData.length;
        showHanja(currentIndex);
    });

    charsetButtons.forEach(button => {
        button.addEventListener('click', () => {
            setMode(button.dataset.charset);
        });
    });

    function initialize() {
        if (hanjaData.length > 0) {
            setMode(currentCharset);
        }
    }

    initialize();
});