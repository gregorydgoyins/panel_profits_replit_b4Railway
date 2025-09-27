import { NewsItem } from '../hooks/useNewsData';

// Helper function to generate random date within range
const getRandomDateInRange = (startDate: Date, endDate: Date): Date => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
};

// Helper function to generate dates over 20 years, excluding the last 7 days
const generateHistoricalDates = (count: number): Date[] => {
  const dates: Date[] = [];
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
  const twentyYearsAgo = new Date(now.getFullYear() - 20, 0, 1);
  
  for (let i = 0; i < count; i++) {
    // Ensure generated dates are not within the last 7 days
    let randomDate;
    do {
      randomDate = getRandomDateInRange(twentyYearsAgo, sevenDaysAgo);
    } while (randomDate.getTime() > sevenDaysAgo.getTime()); // Regenerate if it falls within last 7 days
    dates.push(randomDate);
  }
  
  return dates.sort((a, b) => b.getTime() - a.getTime()); // Most recent first
};

export interface CreateNewsArticleData {
  title: string;
  description?: string;
  content: string;
  url: string;
  source: string;
  impact: 'positive' | 'negative' | 'neutral';
  imageUrl?: string;
  keywords: string[];
  videoUrl?: string;
  secondaryVideoUrl?: string;
  author?: string;
  category?: string;
  relatedSecurities?: Array<{
    type: 'comic' | 'creator' | 'publisher' | 'option';
    symbol: string;
    name: string;
  }>;
}

export interface UpdateNewsArticleData {
  title?: string;
  description?: string;
  content?: string;
  impact?: 'positive' | 'negative' | 'neutral';
  keywords?: string[];
  category?: string;
}

interface NewsServiceResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

// Clean, static news stories data
const createNewsStories = (): NewsItem[] => {
  // Generate 20 years of historical dates
  const historicalDates = generateHistoricalDates(95); // Generate enough dates for all stories
  
  const baseStories = [
    {
      id: 'NS1',
      title: 'Marvel Beats Earnings Expectations',
      description: 'Q3 results exceed analyst forecasts by 18%, driving comic stock prices higher',
        content: `Marvel Entertainment has delivered exceptional Q3 2025 earnings results that significantly exceeded Wall Street expectations, sending comic-related stocks soaring in after-hours trading.

Despite weaker box office performance for Marvel's theatrical releases in Q3 2025, the brand's content played a pivotal role in boosting Disney+'s subscriber numbers and overall revenue for Disney's Direct-to-Consumer (DTC) segment.

Disney+ added 1.8 million subscribers in Q3 2025, reaching a total of 128 million subscribers. Marvel films, particularly Captain America: Brave New World, Thunderbolts*, and The Fantastic Four: First Steps, which were released theatrically earlier in 2025 and subsequently streamed on Disney+, consistently landed on the platform's worldwide Top Ten list. This popularity demonstrates that Marvel films continue to drive engagement and attract new subscribers to the platform.

Disney+ experienced a significant increase in average monthly revenue per paid subscriber (ARPU) in Q3 2025. This growth was driven in part by higher advertising revenue, with Marvel's popular content attracting premium advertisers and contributing to a stronger revenue stream. The ARPU enhancement indicates Disney's successful monetization strategy through combined subscriptions and advertising.

The DTC segment, encompassing Disney+, Hulu, and ESPN+, posted an operating profit of $346 million in Q3 2025—a dramatic turnaround from the $19 million loss reported in the same period a year ago. This remarkable profitability improvement reflects Disney's increased focus on streaming monetization and successful execution of its integrated streaming strategy, with Marvel content serving as a primary driver of viewership and engagement.

Comic book sales reached $890 million, marking the highest quarterly performance in Marvel's 85-year history. The surge was amplified by record-breaking movie tie-in issues, premium variant cover collections, and the company's expanding digital ownership platform.

Licensing revenue jumped 45% year-over-year, while Marvel's creator royalty program successfully attracted top-tier talent with exclusive multi-year deals worth hundreds of millions. The company's Panel Profits trading platform generated $125 million in transaction fees during its first quarter of operation.

Goldman Sachs has raised their price target from $285 to $350, citing "sustainable competitive advantages in both traditional publishing and emerging digital asset markets, combined with Disney's proven ability to monetize Marvel content across multiple revenue streams." Trading volume increased 340% in after-hours sessions as institutional investors repositioned portfolios.

This integrated approach demonstrates the importance of Disney's multi-platform strategy, using streaming as a vehicle to broaden reach and monetize franchises beyond traditional theatrical windows. Marvel's compelling content on Disney+ has proven to be a valuable asset in the evolving entertainment landscape.`,
      publishedAt: historicalDates[0],
      url: '/news/NS1',
      source: 'Financial Times',
      impact: 'positive',
      imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
      // Video URLs - external services blocked in WebContainer
      videoUrl: 'https://www.youtube.com/embed/UhVjp48U2Oc',
      secondaryVideoUrl: 'https://drive.google.com/file/d/1aYpSQW3TImbuONAZYGBTRTKoSnmiPnU6/preview',
      keywords: ['Marvel', 'Earnings', 'Financial', 'Trading'],
      relatedSecurity: {
        type: 'publisher',
        symbol: 'MRVL',
        name: 'Marvel Entertainment'
      }
    },
    {
      id: 'NS2',
      title: 'Spider-Man 4 Production Confirmed',
      description: 'Sony Pictures announces Spider-Man 4 with Tom Holland returning',
      content: `Sony Pictures Entertainment has officially confirmed that Spider-Man 4 is entering production, with Tom Holland reprising his role as the web-slinging superhero. The announcement has sent Spider-Man related comic assets surging.

Director Jon Watts is returning to helm the fourth installment, which will begin filming in early 2025. The movie is scheduled for release in July 2026, continuing the successful partnership between Sony and Marvel Studios.

Industry analysts expect this announcement to drive significant interest in Spider-Man comics, particularly key issues like Amazing Fantasy #15 and Amazing Spider-Man #300. Trading volume for Spider-Man character stocks has increased 250% since the announcement.

The film will reportedly explore the multiverse concept further, potentially featuring previous Spider-Man actors Tobey Maguire and Andrew Garfield. This multiverse approach has historically driven collector interest across multiple Spider-Man comic eras.

Comic retailers report immediate increases in Spider-Man comic sales, with some variants selling out within hours of the announcement. The character's popularity rating has jumped 8 points to an all-time high of 98%.`,
      publishedAt: historicalDates[1],
      url: '/news/NS2',
      source: 'Entertainment Weekly',
      impact: 'positive',
      imageUrl: 'https://images.pexels.com/photos/163186/spider-web-with-water-beads-network-dewdrop-163186.jpeg',
      keywords: ['Spider-Man', 'Movie', 'Sony', 'Marvel'],
      relatedSecurity: {
        type: 'character',
        symbol: 'SPDR',
        name: 'Spider-Man'
      }
    },
    {
      id: 'NS3',
      title: 'DC Comics Restructures Editorial Team',
      description: 'Major changes to creative leadership affect multiple ongoing series',
      content: `DC Comics has announced a comprehensive restructuring of their editorial department, with new leadership taking over several major title families. The changes affect Batman, Superman, Wonder Woman, and Justice League publications.

New Editor-in-Chief Marie Javins outlined a vision for "renewed storytelling focus and creator empowerment." The restructuring includes the appointment of three new senior editors and the consolidation of several editorial departments.

While the changes are positioned as growth-oriented, some industry observers express concern about potential disruption to ongoing storylines. Several high-profile creators have been reassigned to different projects, creating uncertainty in the market.

DC stock has shown mixed reactions to the news, with some investors viewing the changes as necessary modernization while others worry about creative continuity. The stock closed down 1.2% but recovered partially in after-hours trading.

The restructuring comes as DC faces increased competition from independent publishers and streaming services seeking original content. Analysts will be watching closely to see how these changes affect upcoming releases and creator retention.`,
      publishedAt: historicalDates[2],
      url: '/news/NS3',
      source: 'Comics Alliance',
      impact: 'neutral',
      imageUrl: 'https://images.pexels.com/photos/159591/construction-site-build-construction-work-159591.jpeg',
      keywords: ['DC Comics', 'Editorial', 'Restructure', 'Leadership'],
      relatedSecurity: {
        type: 'publisher',
        symbol: 'DCCP',
        name: 'DC Comics'
      }
    },
    {
      id: 'NS4',
      title: 'Todd McFarlane Teases Major Spawn Project',
      description: 'Creator hints at biggest Spawn announcement in decades',
      content: `Todd McFarlane has been building anticipation for what he calls "the biggest Spawn project in 30 years," scheduled to be revealed next month. The creator's cryptic social media posts have sparked intense speculation among fans and investors.

Industry insiders suggest the announcement could involve anything from a major movie deal to a massive crossover event with other publishers. McFarlane's previous projects have consistently driven significant value increases for Spawn-related assets.

McFarlane stock has experienced increased volatility, with trading volume up 180% over the past week. The stock is currently trading 15% above its monthly average as investors position themselves ahead of the announcement.

The creator's track record with major announcements has historically resulted in substantial market moves. His 2019 Spawn movie update drove the stock up 23% in a single trading session, while his 2021 toy line expansion announcement resulted in a sustained 40% increase over three months.

Spawn #350, a milestone issue scheduled for release this fall, is expected to be part of whatever announcement McFarlane is planning. The issue has already generated significant pre-order interest from collectors and speculators.`,
      publishedAt: historicalDates[3],
      url: '/news/NS4',
      source: 'Comic Creator News',
      impact: 'positive',
      imageUrl: 'https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg',
      keywords: ['Todd McFarlane', 'Spawn', 'Announcement', 'Creator'],
      relatedSecurity: {
        type: 'creator',
        symbol: 'TMFS',
        name: 'Todd McFarlane'
      }
    },
    {
      id: 'NS5',
      title: 'CGC Updates Grading Standards',
      description: 'New criteria could impact comic valuations across all eras',
      content: `CGC (Certified Guaranty Company) has announced significant updates to their comic book grading standards, effective immediately. The changes primarily affect how condition defects are evaluated for Silver and Bronze Age comics.

The updated standards introduce more stringent criteria for spine stress, color breaking, and bindery defects. Comics previously graded at 9.0 or higher may receive lower grades under the new system, potentially affecting market values.

Initial market reaction has been mixed, with some investors concerned about the impact on existing graded collections, while others view the changes as necessary for maintaining grading integrity. Several major auction houses have delayed upcoming sales to reassess lot valuations.

CGC President Mark Haspel emphasized that the changes "ensure our grading remains the gold standard for comic book authentication and condition assessment." The company will offer re-grading services at reduced rates for comics graded in the past two years.

Market analysts estimate that approximately 15% of currently graded Silver Age comics and 8% of Bronze Age comics could be affected by the new standards. This has created uncertainty in pricing for several key issues.`,
      publishedAt: historicalDates[4],
      url: '/news/NS5',
      source: 'Grading News Today',
      impact: 'neutral',
      imageUrl: 'https://images.pexels.com/photos/159581/dictionary-reference-book-learning-study-159581.jpeg',
      keywords: ['CGC', 'Grading', 'Standards', 'Valuation'],
      relatedSecurity: {
        type: 'comic',
        symbol: 'ASM300',
        name: 'Amazing Spider-Man #300'
      }
    },
    {
      id: 'NS6',
      title: 'Comic Convention Season Drives Trading Volume',
      description: 'Convention announcements boost character and creator stocks',
      content: `The upcoming comic convention season has already begun driving increased trading activity, with several major events announcing guest lists and exclusive releases. San Diego Comic-Con, New York Comic Con, and Emerald City Comic Con have all confirmed high-profile creator appearances.

Trading volume for character stocks has increased 45% over the past two weeks as investors position themselves ahead of expected announcements. Historical data shows that major conventions typically drive 15-30% increases in related asset values.

Notable creator confirmations include Jim Lee, Todd McFarlane, and Scott Snyder for various convention appearances. Their stock prices have shown corresponding increases, with McFarlane stock up 8% since his SDCC confirmation.

Convention exclusive variants and limited edition releases have become increasingly important market drivers. Last year's convention season generated over $50 million in exclusive comic sales, with some variants appreciating 200% within months of release.

Industry watchers are particularly focused on potential movie and TV announcements that typically occur during these events. Streaming services have increasingly used comic conventions to announce new projects, creating immediate market opportunities.`,
      publishedAt: historicalDates[5],
      url: '/news/NS6',
      source: 'Convention Central',
      impact: 'positive',
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0902ba2fe65?w=400',
      keywords: ['Conventions', 'Trading', 'Creators', 'Exclusives'],
      relatedSecurity: {
        type: 'creator',
        symbol: 'JLES',
        name: 'Jim Lee'
      }
    },
    {
      id: 'NS7',
      title: 'Independent Publishers Gain Market Share',
      description: 'Image Comics and other independents show strong growth',
      content: `Independent comic publishers are experiencing unprecedented growth, with Image Comics leading the charge by reporting a 28% increase in market share over the past year. This growth comes at the expense of traditional Big Two dominance.

Image's success has been driven by creator-owned series like Saga, The Walking Dead universe expansions, and strong digital sales. The publisher's creator-friendly policies continue to attract top talent from Marvel and DC.

Other independent publishers including Dark Horse Comics, IDW Publishing, and Boom! Studios have also reported strong performance. Combined, independent publishers now control 35% of the market, up from 28% last year.

This shift has created new investment opportunities in creator stocks and independent publisher bonds. Many creators who have moved to independent publishing have seen their stock values increase as they gain greater control over their intellectual property.

The trend reflects changing consumer preferences toward diverse storytelling and original content. Streaming services have shown increased interest in adapting independent comic properties, further driving valuations in this sector.`,
      publishedAt: historicalDates[6],
      url: '/news/NS7',
      source: 'Independent Comics News',
      impact: 'positive',
      imageUrl: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg',
      keywords: ['Independent', 'Market Share', 'Growth', 'Publishers'],
      relatedSecurity: {
        type: 'publisher',
        symbol: 'IMGC',
        name: 'Image Comics'
      }
    },
    {
      id: 'NS8',
      title: 'Batman Character Stock Reaches All-Time High',
      description: 'The Dark Knight asset hits record valuation of CC 4,500',
      content: `Batman character stock has reached an all-time high of CC 4,500, driven by sustained media presence and upcoming project announcements. The character's 85-year history continues to generate strong investor confidence.

The recent surge follows confirmation of "The Batman Part II" production schedule and rumors of additional DC Extended Universe appearances. Batman's consistent performance across all media formats makes it a cornerstone holding for many comic portfolios.

Analyst firm Comic Capital Research upgraded Batman stock to "Strong Buy" with a price target of CC 5,200, citing "unparalleled brand recognition and media adaptability." The character maintains the highest Q-Score among all comic book properties.

Trading volume has been exceptional, with institutional investors increasing their Batman allocations. The character's low correlation with market volatility makes it an attractive defensive holding during uncertain market conditions.

Batman's supporting character ecosystem, including Robin variants and villain stocks, has also benefited from the primary character's strength. The Joker stock has gained 12% since Batman's rally began, demonstrating the interconnected nature of comic character valuations.`,
      publishedAt: historicalDates[7],
      url: '/news/NS8',
      source: 'Hero Market Report',
      impact: 'positive',
      imageUrl: 'https://images.pexels.com/photos/114741/pexels-photo-114741.jpeg',
      keywords: ['Batman', 'All-Time High', 'Character Stock', 'Record'],
      relatedSecurity: {
        type: 'character',
        symbol: 'BATM',
        name: 'Batman'
      }
    },
    {
      id: 'NS9',
      title: 'Comic Market Volatility Increases',
      description: 'Market uncertainty affects trading patterns across all sectors',
      content: `The comic book investment market has experienced increased volatility over the past week, with daily price swings exceeding 5% for several major assets. Market analysts attribute this to uncertainty surrounding upcoming earnings reports and regulatory discussions.

The Comic Volatility Index (CVX) has risen to 28.5, its highest level since the pandemic-era market disruption of 2020. Both character stocks and creator assets have shown heightened sensitivity to news events and social media speculation.

Professional traders are adjusting their strategies to account for the increased volatility, with many implementing tighter stop-loss orders and reducing position sizes. Options activity has increased 85% as traders seek to hedge their portfolios.

Despite the volatility, underlying fundamentals remain strong. Comic sales continue to grow, media adaptations are increasing, and new investor interest continues to flow into the market. Many analysts view the current volatility as a temporary adjustment period.

Risk management has become crucial in this environment. Portfolio diversification across different comic eras, publishers, and asset types is providing some protection against the increased market swings.`,
      publishedAt: historicalDates[8],
      url: '/news/NS9',
      source: 'Market Volatility Report',
      impact: 'negative',
      imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
      keywords: ['Volatility', 'Market', 'Trading', 'Risk'],
      relatedSecurity: {
        type: 'comic',
        symbol: 'CVX',
        name: 'Comic Volatility Index'
      }
    },
    {
      id: 'NS10',
      title: 'New Creator Bond Offerings Announced',
      description: 'Three major creators launch bond programs for fan investors',
      content: `Three prominent comic creators have announced new bond offerings, providing fans and investors with fixed-income opportunities backed by creator royalties and intellectual property rights.

Brian K. Vaughan, Fiona Staples, and Robert Kirkman are leading this innovative financing approach, offering 5-year bonds with yields ranging from 4.5% to 6.2%. The bonds are secured by royalty streams from their existing and future works.

This represents a new asset class in comic investing, providing steady income potential while supporting creator independence. The bonds have received strong institutional interest, with several hedge funds already committing to large positions.

Creator bond offerings address the growing demand for alternative investments within the comic market. Unlike character stocks, these bonds provide predictable income streams and lower volatility, making them attractive for risk-averse investors.

The success of these initial offerings could lead to a broader trend of creator-backed securities. Industry experts predict this could revolutionize how creators finance their projects and how fans participate in their success.`,
      publishedAt: historicalDates[9],
      url: '/news/NS10',
      source: 'Creator Finance Weekly',
      impact: 'positive',
      imageUrl: 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg',
      keywords: ['Creator Bonds', 'Fixed Income', 'Innovation', 'Investment'],
      relatedSecurity: {
        type: 'creator',
        symbol: 'BKVN',
        name: 'Brian K. Vaughan'
      }
    }
  ];

  // Generate 75 total stories by expanding the base stories
  const allStories: NewsItem[] = [...baseStories];
  
  // Create variations of existing stories to reach 75 total
  const storyVariations = [
    // Marvel earnings variations
    {
      id: 'NS11',
      title: 'Marvel Entertainment Reports Record-Breaking Q3 Revenue Performance',
      description: 'Disney subsidiary exceeds analyst predictions with strongest quarterly results in company history',
      content: 'Marvel Entertainment has delivered its strongest quarterly performance in company history, with Q3 2025 results that significantly outpaced Wall Street expectations. The entertainment giant reported revenue growth of 22% year-over-year, driven primarily by streaming success and strategic content licensing deals. This news is a variation of NS1.',
      publishedAt: new Date('2025-01-14T16:30:00'),
      url: '/news/NS11',
      source: 'Entertainment Finance Weekly',
      impact: 'positive',
      imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400',
      keywords: ['Marvel', 'Revenue', 'Quarterly', 'Performance'],
      relatedSecurity: {
        type: 'publisher',
        symbol: 'MRVL',
        name: 'Marvel Entertainment'
      }
    },
    {
      id: 'NS12',
      title: 'Spider-Man Universe Expansion Drives Marvel Stock Surge in After-Hours Trading',
      description: 'Sony partnership announcement creates bullish sentiment for Spider-Man related assets',
      content: 'Following the announcement of an expanded Spider-Man universe collaboration between Sony Pictures and Marvel Studios, related character stocks have seen unprecedented trading volume. The partnership will include multiple film projects and streaming series, creating significant value for Spider-Man intellectual property. This news is a variation of NS2.',
      publishedAt: new Date('2025-01-14T12:15:00'),
      url: '/news/NS12',
      source: 'Hollywood Trade Reporter',
      impact: 'positive',
      imageUrl: 'https://images.pexels.com/photos/163186/spider-web-with-water-beads-network-dewdrop-163186.jpeg',
      keywords: ['Spider-Man', 'Sony', 'Universe', 'Expansion'],
      relatedSecurity: {
        type: 'character',
        symbol: 'SPDR',
        name: 'Spider-Man'
      }
    },
    {
      id: 'NS13',
      title: 'DC Comics Leadership Restructuring Creates Uncertainty in Publishing Division',
      description: 'Multiple executive departures signal potential strategic shift in comic book operations',
      content: 'DC Comics has announced significant changes to its executive structure, with several key leadership positions being restructured. The changes come amid increasing competition from streaming services and independent publishers, raising questions about the company\'s future strategic direction. This news is a variation of NS3.',
      publishedAt: new Date('2025-01-13T09:45:00'),
      url: '/news/NS13',
      source: 'Publishing Industry Analysis',
      impact: 'negative',
      imageUrl: 'https://images.pexels.com/photos/159591/construction-site-build-construction-work-159591.jpeg',
      keywords: ['DC Comics', 'Leadership', 'Restructuring', 'Executive'],
      relatedSecurity: {
        type: 'publisher',
        symbol: 'DCCP',
        name: 'DC Comics'
      }
    },
    {
      id: 'NS14',
      title: 'Todd McFarlane Confirms Spawn Universe Television Series Development with Streaming Giant',
      description: 'Creator announces multi-season deal for Spawn TV adaptation with major streaming platform',
      content: 'Todd McFarlane has officially confirmed that a Spawn television series is in active development with a major streaming platform. The multi-season deal represents the largest TV investment in the Spawn universe to date, with production set to begin in early 2025. This news is a variation of NS4.',
      publishedAt: new Date('2025-01-12T14:20:00'),
      url: '/news/NS14',
      source: 'Streaming Television News',
      impact: 'positive',
      imageUrl: 'https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg',
      keywords: ['Todd McFarlane', 'Spawn', 'Television', 'Streaming'],
      relatedSecurity: {
        type: 'creator',
        symbol: 'TMFS',
        name: 'Todd McFarlane'
      }
    },
    {
      id: 'NS15',
      title: 'Comic Grading Services Report Significant Backlog as Submission Volumes Reach All-Time Highs',
      description: 'CGC and CBCS struggle with unprecedented demand for professional comic book grading services',
      content: 'Professional comic grading services are experiencing record submission volumes, with CGC reporting a 6-month backlog and CBCS announcing extended processing times. The surge in submissions reflects increased collector activity and investment interest in comic assets. This news is a variation of NS5.',
      publishedAt: new Date('2025-01-11T11:30:00'),
      url: '/news/NS15',
      source: 'Collector Services Report',
      impact: 'neutral',
      imageUrl: 'https://images.pexels.com/photos/159581/dictionary-reference-book-learning-study-159581.jpeg',
      keywords: ['CGC', 'CBCS', 'Grading', 'Backlog'],
      relatedSecurity: {
        type: 'comic',
        symbol: 'ASM300',
        name: 'Amazing Spider-Man #300'
      }
    }
  ];

  // Add the variations to the main stories
  allStories.push(...storyVariations);
    
    // Generate more diverse stories to reach 95 total, using historical dates
    const additionalBaseStories = [
      {
        id: 'NS16',
        title: 'Independent Comics Market Surge Continues',
        description: 'Smaller publishers see unprecedented growth in collector interest',
        content: 'The independent comic market has experienced remarkable growth throughout 2025, with publishers like Dark Horse, IDW, and Boom! Studios reporting record sales figures. This trend represents a significant shift in collector preferences toward diverse storytelling and creator-owned properties.',
        publishedAt: new Date('2025-01-05T16:45:00'),
        url: '/news/NS16',
        source: 'Independent Publishers Weekly',
        impact: 'positive',
        imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
        keywords: ['Independent', 'Publishers', 'Growth', 'Market'],
        relatedSecurity: {
          type: 'publisher',
          symbol: 'DKHS',
          name: 'Dark Horse Comics'
        }
      },
      {
        id: 'NS17', 
        title: 'Digital Comics Platform Launches New Trading Features',
        description: 'Major digital platform introduces fractional ownership of premium comics',
        content: 'A leading digital comics platform has announced revolutionary new features allowing collectors to purchase fractional shares of high-value comics. This innovation democratizes access to premium collectibles and creates new liquidity in the digital comic market.',
        publishedAt: new Date('2025-01-04T11:20:00'),
        url: '/news/NS17',
        source: 'Digital Comics Today',
        impact: 'positive',
        imageUrl: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=400',
        keywords: ['Digital', 'Platform', 'Fractional', 'Trading'],
        relatedSecurity: {
          type: 'publisher',
          symbol: 'DGTL',
          name: 'Digital Comics Corp'
        }
      },
      {
        id: 'NS18',
        title: 'Vintage Comic Auction Sets New Records',
        description: 'Heritage Auctions reports strongest quarter in company history',
        content: 'Heritage Auctions has concluded its strongest quarter ever, with vintage comic sales exceeding $200 million. The results indicate robust demand for high-grade Silver and Golden Age comics, with several world record prices achieved.',
        publishedAt: new Date('2025-01-03T14:30:00'),
        url: '/news/NS18',
        source: 'Auction House Report',
        impact: 'positive',
        imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        keywords: ['Auction', 'Heritage', 'Records', 'Vintage'],
        relatedSecurity: {
          type: 'comic',
          symbol: 'ACM1',
          name: 'Action Comics #1'
        }
      },
      {
        id: 'NS19',
        title: 'Graphic Novel Market Experiences Explosive Growth',
        description: 'Trade paperback collections drive new investment interest',
        content: 'The graphic novel and trade paperback market has seen explosive growth, with bookstore sales increasing 45% year-over-year. This trend is creating new investment opportunities in collected editions and omnibus formats.',
        publishedAt: new Date('2025-01-02T09:15:00'),
        url: '/news/NS19',
        source: 'Book Trade Weekly',
        impact: 'positive',
        imageUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
        keywords: ['Graphic Novel', 'Trade', 'Growth', 'Collections'],
        relatedSecurity: {
          type: 'publisher',
          symbol: 'MRVL',
          name: 'Marvel Entertainment'
        }
      },
      {
        id: 'NS20',
        title: 'International Comic Markets Show Strong Performance',
        description: 'European and Asian comic investments gain momentum globally',
        content: 'International comic markets, particularly in Europe and Asia, are showing remarkable strength. Manga investments and European graphic novels are attracting significant international capital, expanding the global comic investment landscape.',
        publishedAt: new Date('2025-01-01T18:45:00'),
        url: '/news/NS20',
        source: 'Global Comics Report',
        impact: 'positive',
        imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
        keywords: ['International', 'Global', 'Manga', 'Europe'],
        relatedSecurity: {
          type: 'publisher',
          symbol: 'INTL',
          name: 'International Comics Index'
        }
      }
    ];
    
    // Add the additional base stories
    allStories.push(...additionalBaseStories);
    
    // Generate additional stories to reach 95 total with clean titles
    while (allStories.length < 95) {
      const baseStory = baseStories[allStories.length % baseStories.length];
      const storyNumber = allStories.length + 1;
      
      // Array of diverse Pexels images for news stories
      const pexelsImages = [
        'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/2330137/pexels-photo-2330137.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265686/pexels-photo-265686.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265685/pexels-photo-265685.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097491/pexels-photo-1097491.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097445/pexels-photo-1097445.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/159581/dictionary-reference-book-learning-study-159581.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184310/pexels-photo-3184310.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265637/pexels-photo-265637.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184305/pexels-photo-3184305.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265672/pexels-photo-265672.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097490/pexels-photo-1097490.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184382/pexels-photo-3184382.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184345/pexels-photo-3184345.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184387/pexels-photo-3184387.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097495/pexels-photo-1097495.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184356/pexels-photo-3184356.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265668/pexels-photo-265668.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097464/pexels-photo-1097464.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181365/pexels-photo-1181365.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184470/pexels-photo-3184470.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265664/pexels-photo-265664.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184344/pexels-photo-3184344.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097480/pexels-photo-1097480.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265656/pexels-photo-265656.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097461/pexels-photo-1097461.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184376/pexels-photo-3184376.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265663/pexels-photo-265663.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184352/pexels-photo-3184352.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097474/pexels-photo-1097474.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184607/pexels-photo-3184607.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265676/pexels-photo-265676.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184395/pexels-photo-3184395.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184462/pexels-photo-3184462.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097487/pexels-photo-1097487.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/265679/pexels-photo-265679.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097477/pexels-photo-1097477.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184417/pexels-photo-3184417.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1097492/pexels-photo-1097492.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3184397/pexels-photo-3184397.jpeg?auto=compress&cs=tinysrgb&w=400'
      ];
      
      const newStory: NewsItem = {
        ...baseStory,
        id: `NS${storyNumber}`,
        title: baseStory.title.replace(/Update \d+/g, '').replace(/ - $/, ''),
        description: baseStory.description,
        content: baseStory.content,
        publishedAt: historicalDates[storyNumber - 1], // Use pre-generated historical dates
        url: `/news/NS${storyNumber}`,
        imageUrl: pexelsImages[(storyNumber - 16) % pexelsImages.length]
      };
      
      allStories.push(newStory);
    }

  return allStories;
};

// News Service Class
class NewsService {
  private stories: NewsItem[];
  private lastFetchTime: number;
  private fetchCount: number;

  constructor() {
    this.stories = createNewsStories();
    this.lastFetchTime = 0;
    this.fetchCount = 0;
  }

  private getRandomizedStories(limit: number): NewsItem[] {
    // Create a copy and randomize order
    const shuffled = [...this.stories].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(limit, shuffled.length));
  }

  async getNewsArticles(options: {
    limit?: number;
    category?: string;
    impact?: string;
    source?: string;
    excludeLastWeek?: boolean; // New option to exclude news from the last week
  } = {}): Promise<NewsServiceResponse<NewsItem[]>> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 100));
      
      const { limit = 0, category, impact, source } = options;
      
      let stories = [...this.stories]; // Use original order instead of randomized
      
      // Apply filters
      if (category && category !== 'all') {
        stories = stories.filter(story => 
          story.keywords.some(k => k.toLowerCase().includes(category.toLowerCase()))
        );
      }
      
      if (impact && impact !== 'all') {
        stories = stories.filter(story => story.impact === impact);
      }
      
      if (source && source !== 'all') {
        stories = stories.filter(story => story.source === source);
      }
      
      // Filter out news from the last week if requested
      if (options.excludeLastWeek) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        stories = stories.filter(story => new Date(story.publishedAt) < sevenDaysAgo);
      }

      // Sort by date
      stories.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      // Apply limit after filtering and sorting
      if (limit && limit > 0) {
        stories = stories.slice(0, limit);
      }
      
      this.fetchCount++;
      this.lastFetchTime = Date.now();
      
      return { data: stories, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Failed to fetch news articles' }
      };
    }
  }

  async getNewsArticleById(id: string): Promise<NewsServiceResponse<NewsItem>> {
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      
      const article = this.stories.find(story => story.id === id);
      
      if (!article) {
        return {
          data: null,
          error: { message: 'Article not found' }
        };
      }
      
      return { data: article, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Failed to fetch article' }
      };
    }
  }

  async getFeaturedNews(): Promise<NewsServiceResponse<NewsItem[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 125 + 75));
      
      const featuredStories = this.stories
        .filter(story => story.impact === 'positive')
        .slice(0, 5);
      
      return { data: featuredStories, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Failed to fetch featured news' }
      };
    }
  }

  async getNewsByCategory(category: string, limit: number = 10): Promise<NewsServiceResponse<NewsItem[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 125 + 75));
      
      const categoryStories = this.stories
        .filter(story => story.keywords.some(k => k.toLowerCase().includes(category.toLowerCase())))
        .slice(0, limit);
      
      return { data: categoryStories, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Failed to fetch category news' }
      };
    }
  }

  async searchNewsArticles(query: string, options: {
    limit?: number;
    category?: string;
    impact?: string;
  } = {}): Promise<NewsServiceResponse<NewsItem[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 100));
      
      const { limit = 10, category, impact } = options;
      const lowercaseQuery = query.toLowerCase();
      
      let results = this.stories.filter(story =>
        story.title.toLowerCase().includes(lowercaseQuery) ||
        story.content.toLowerCase().includes(lowercaseQuery) ||
        story.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery)) ||
        story.source.toLowerCase().includes(lowercaseQuery)
      );
      
      if (category && category !== 'all') {
        results = results.filter(story => story.keywords.some(k => k.toLowerCase().includes(category.toLowerCase())));
      }
      
      if (impact && impact !== 'all') {
        results = results.filter(story => story.impact === impact);
      }
      
      results = results
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, limit);
      
      return { data: results, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Search failed' }
      };
    }
  }

  async createNewsArticle(articleData: CreateNewsArticleData): Promise<NewsServiceResponse<NewsItem>> {
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
      
      const newArticle: NewsItem = {
        id: `NS${this.stories.length + 1}`,
        title: articleData.title,
        description: articleData.description,
        content: articleData.content,
        publishedAt: new Date(),
        url: articleData.url,
        source: articleData.source,
        impact: articleData.impact,
        imageUrl: articleData.imageUrl,
        keywords: articleData.keywords,
        videoUrl: articleData.videoUrl,
        secondaryVideoUrl: articleData.secondaryVideoUrl,
        relatedSecurity: articleData.relatedSecurities?.[0]
      };
      
      this.stories.push(newArticle);
      
      return { data: newArticle, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Failed to create article' }
      };
    }
  }

  async updateNewsArticle(id: string, updates: UpdateNewsArticleData): Promise<NewsServiceResponse<NewsItem>> {
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 150));
      
      const articleIndex = this.stories.findIndex(story => story.id === id);
      
      if (articleIndex === -1) {
        return {
          data: null,
          error: { message: 'Article not found' }
        };
      }
      
      const updatedArticle = {
        ...this.stories[articleIndex],
        ...updates
      };
      
      this.stories[articleIndex] = updatedArticle;
      
      return { data: updatedArticle, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Failed to update article' }
      };
    }
  }

  async deleteNewsArticle(id: string): Promise<NewsServiceResponse<boolean>> {
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 100));
      
      const articleIndex = this.stories.findIndex(story => story.id === id);
      
      if (articleIndex === -1) {
        return {
          data: null,
          error: { message: 'Article not found' }
        };
      }
      
      this.stories.splice(articleIndex, 1);
      
      return { data: true, error: null };
    } catch (error) {
      return {
        data: null,
        error: { message: error instanceof Error ? error.message : 'Failed to delete article' }
      };
    }
  }

  // Utility methods
  getAllStories(): NewsItem[] {
    return [...this.stories];
  }

  getServiceStats() {
    return {
      totalStories: this.stories.length,
      fetchCount: this.fetchCount,
      lastFetchTime: this.lastFetchTime
    };
  }
}

const newsService = new NewsService();
export { newsService };
export default newsService;