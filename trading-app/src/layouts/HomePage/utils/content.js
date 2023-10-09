// Section1
import ShootingStarImage from "../assets/images/section1/main-bg-0-0.png";
import MainBG from "../assets/images/section1/main-bg-0_1.webp";
import bgImage1 from "../../../assets/images/bgBanner1.jpg";
import TreesImage from "../assets/images/section1/main-bg-1_1.webp";
import CliffImage from "../assets/images/section1/main-bg-2_1.webp";
import HorseImage from "../assets/images/section1/main-bg-3.png";

// Section3
import EthImg from "../assets/images/section3/eth.webp";
import BscImg from "../assets/images/section3/bsc.webp";
import PolygonImg from "../assets/images/section3/polygon.webp";
import OptimismImg from "../assets/images/section3/optimism.webp";
import GnosisImg from "../assets/images/section3/gnosis.webp";
import AvalancheImg from "../assets/images/section3/avalanche.webp";
import ArbitrumImg from "../assets/images/section3/arbitrum.webp";
import FantomImg from "../assets/images/section3/fantom.webp";
import KlaytnImg from "../assets/images/section3/klaytn.webp";
import AuroraImg from "../assets/images/section3/aurora.webp";

// Section4
import NewsImg from "../assets/images/section4/news-image.png";
import Phone1Img from "../assets/images/section4/wallet-buy.png";

import Phone3Img from "../assets/images/section4/wallet-store.png";

import Phone5Img from "../assets/images/section4/wallet-transfer.png";

// Section5
import BannerBgImage from "../assets/images/section5/news-block-background.webp";
import BannerBgImageMobile from "../assets/images/section5/news-block-background-mobile.webp";

// Section6
// import Sec6Image1 from "../assets/images/section6/aggregation-protocol.webp";
// import Sec6Image2 from "../assets/images/section6/limit-order-protocol.webp";
// import Sec6Image3 from "../assets/images/section6/liquidity-protocol.webp";
// import Sec6Image4 from "../assets/images/section6/earn_1.webp";
// import Sec6Image5 from "../assets/images/section6/rabbithole.webp";



// Section8
import ShieldImage from "../assets/images/section8/shield.webp";

// Section9
import Sec9Image1 from "../assets/images/section9/dao.webp";
import Sec9Image2 from "../assets/images/section9/token.webp";

// Section10
import DiscordImage from "../assets/images/section10/discord.webp";
import RedditImage from "../assets/images/section10/reddit.webp";
import TelegramImage from "../assets/images/section10/telegram.webp";
import TwitterImage from "../assets/images/section10/twitter.webp";

// Section11
import Near from "../assets/images/section11/near.svg";
import Metamask from "../assets/images/section11/metamask.svg";
import Trustwallet from "../assets/images/section11/trustwallet.svg";
import Opium from "../assets/images/section11/opium.svg";
import Zerion from "../assets/images/section11/zerion.svg";
import Revolut from "../assets/images/section11/revolut.svg";
import Pantera from "../assets/images/section11/pantera.svg";
import Binancelab from "../assets/images/section11/binance-lab.svg";
import Dragonflycapital from "../assets/images/section11/dragonfly-capital.svg";
import Galaxydigital from "../assets/images/section11/galaxy-digital.svg";
import Paraficapital from "../assets/images/section11/parafi-capital.svg";
import Gemini from "../assets/images/section11/gemini.svg";
import Mew from "../assets/images/section11/mew.svg";
import Atoken from "../assets/images/section11/atoken.svg";
import Dappradar from "../assets/images/section11/dappradar.svg";
import Graph from "../assets/images/section11/graph.svg";
import Staker from "../assets/images/section11/staker.svg";
import Bitpay from "../assets/images/section11/bitPay.svg";

// Footer
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from '@mui/icons-material/Facebook';


// Navbar
import Logo from "../assets/images/Logo.png";

export const section1Content = {
  bgImage1,
  TreesImage,
  CliffImage,
  HorseImage,
  ShootingStarImage,
  title: "Learn, Earn and Grow",
  subtitle: "with realtime virtual options trading",
};

export const section2Content = {
  items: [
    { counter: 13000, subtitle: "Total Signups", name:'totalSignups' },
    { counter: 20000000000, before: "", after: "", subtitle: "Total Traded Volume", name:'totalTradedVolume' },
    { counter: 600000, before: "₹", after: "", subtitle: "Total Wallets Transactions", decimals: false, name:'totalWalletTransactions' },
    { counter: 356345, after: "", subtitle: "Total Trades", decimals: false, name:'totalTrades' },
  ],
};

export const section3Content = {
  title: "Optimize your trades across hundreds of DEXes on multiple networks",
  ITEMS: [
    { logo: EthImg, name: "Ethereum" },
    { logo: BscImg, name: "BNB Chain" },
    { logo: PolygonImg, name: "Polygon" },
    { logo: OptimismImg, name: "Optimism" },
    { logo: GnosisImg, name: "Gnosis" },
    { logo: AvalancheImg, name: "Avalanche" },
    { logo: ArbitrumImg, name: "Arbitrum" },
    { logo: FantomImg, name: "Fantom" },
    { logo: KlaytnImg, name: "Klaytn" },
    { logo: AuroraImg, name: "Aurora" },
  ],
};

export const section4Content = {
  top: {
    title: "StoxHero Platform",
    subtitle:
      "StoxHero provides an intuitive virtual options trading platform for the new age derivaties traders. Our platforms enable our users to learn, earn and grow at the same time solidifying their positions in the ocean of options trading.",
    image: NewsImg,
  },
  bottom: {
    title: "StoxHero Wallet",
    TABS: [
      {
        name: "Transact",
        image: Phone1Img,
        subtitle:
          "Easily top-up your wallet from your preferred method of payment, get your rewards added as wallet balance.",
      },
      {
        name: "Store",
        image: Phone3Img,
        subtitle:
          "Redeem your wallet money through in-app purchases and buying store items.",
      },
      {
        name: "Transfer",
        image: Phone5Img,
        subtitle: "Transfer your profits to your bank account seamlessly and securely.",
      },
      
    ],
  },
};

export const section5Content = {
  bgImage1,
  bgImage1,
  title: "1inch Fusion",
  subtitle:
    "The Fusion upgrade makes swaps on 1inch yet more efficient and secure, combining liquidity from the entire crypto market in one place.",
};

// export const section6Content = {
//   title: "Why Choose Stoxhero?",
//   ITEMS: [
//     {
//       title: "Learn",
//       subtitle:
//         " Enhance skills, expand knowledge, and unlock your trading potential.",
//       image: "https://www.pngall.com/wp-content/uploads/8/Forex-Trading-PNG-Image.png",
//     },
//     {
//       title: "Earn",
//       subtitle:
//         "Profitable learning with trading tools and risk-free trading with money making opportunities.",
//       image: "https://3xincome.online/website/images/forex.png",
//     },
//     {
//       title: "Trade",
//       subtitle:
//         "User-friendly interface with real-time data, analysis & execution for all traders, from beginners to experienced.",
//       image: "https://www.avatrade.co.za/wp-content/uploads/2022/10/what-is-liquidity.png",
//     },
//     {
//       title: "Grow",
//       subtitle:
//         "Transparent, secure, and reliable platform for Intraday Trading. Trusted by traders, for traders.",
//       image: "https://www.pngall.com/wp-content/uploads/8/Trading-PNG.png",
//     },
    
//   ],
// };



export const section8Content = {
  title: "Your decentralized finance shield",
  subtitle:
    "1inch uses sophisticated security measures to protect users' funds in swaps on other DeFi protocols",
  caption:
    "1inch is the most audited project in DeFi. See a list of the most important smart contract audits here.",
  ShieldImage,
};

export const section9Content = {
  title: "Empowered by the community",
  ITEMS: [
    {
      title: "1inch DAO",
      subtitle:
        "A governance tool that enables 1INCH stakers to vote for key protocol parameters.",
      image: Sec9Image1,
    },
    {
      title: "1INCH token",
      subtitle:
        "A token that facilitates 1inch protocol governance and participation in the network's evolution.",
      image: Sec9Image2,
    },
  ],
};

export const section10Content = {
  SOCIALS: [
    { name: "Telegram", image: TelegramImage },
    { name: "Discord", image: DiscordImage },
    { name: "Reddit", image: RedditImage },
    { name: "Twitter", image: TwitterImage },
  ],
};

export const Section11Content = {
  title: "Partners and stakeholders",
  ITEMS: [
    {
      link: "https://near.org/",
      image: Near,
    },
    {
      link: "https://metamask.io/",
      image: Metamask,
    },
    {
      link: "https://trustwallet.com/",
      image: Trustwallet,
    },
    {
      link: "https://opium.network/",
      image: Opium,
    },
    {
      link: "https://zerion.io/",
      image: Zerion,
    },
    {
      link: "https://www.revolut.com/",
      image: Revolut,
    },
    {
      link: "https://panteracapital.com/",
      image: Pantera,
    },
    {
      link: "https://labs.binance.com/",
      image: Binancelab,
    },
    {
      link: "https://www.dcp.capital/",
      image: Dragonflycapital,
    },
    {
      link: "https://www.galaxydigital.io/",
      image: Galaxydigital,
    },
    {
      link: "https://www.parafi.capital/",
      image: Paraficapital,
    },
    {
      link: "https://www.gemini.com/frontier-fund",
      image: Gemini,
    },
    {
      link: "https://www.myetherwallet.com/",
      image: Mew,
    },
    {
      link: "https://www.atoken.com/",
      image: Atoken,
    },
    {
      link: "https://dappradar.com/",
      image: Dappradar,
    },
    {
      link: "https://thegraph.com/",
      image: Graph,
    },
    {
      link: "https://staker.app/",
      image: Staker,
    },
    {
      link: "https://bitpay.com/",
      image: Bitpay,
    },
  ],
};

export const footerContent = {
  protocols: {
    title: "Protocols",
    links: [
      { title: "Liquidity Protocol" },
      { title: "Aggregation Protocol" },
      { title: "Limit Order Protocol" },
    ],
  },
  governance: {
    title: "Governance",
    links: [
      { title: "1inch DAO" },
      { title: "1INCH token" },
      { title: "Forum" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { title: "Help center" },
      { title: "Press room" },
      { title: "Bug report", subtitle: "by Hacker one" },
      { title: "Contacts" },
    ],
  },
  developers: {
    title: "Governance",
    links: [
      { title: "Documentation" },
      { title: "GitHub" },
      { title: "Audit" },
      { title: "Bug bounty" },
    ],
  },
  subscribe: {
    title: "Contact Stoxhero now ",
    subtitle: "Get To know more about us",
  },
  socials: [
    { icon: LinkedInIcon },
    { icon: InstagramIcon },
    { icon: TwitterIcon },
    { icon: FacebookIcon },
    
    
  ],
  copyright: {
    left: "© 2023 1inch, All Rights Reserved.",
    center: "ENS: 1inch.eth",
    right: "BUIDL @ETHNewYork 2019",
  },
};

// export const navbarContent = {
//   Logo,
// };