import 'server-only';

export interface CompanyDirectoryEntry {
  name: string;
  aliases?: string[];
  domains: string[];
  careerUrl: string;
  searchUrls?: string[];
  workday?: {
    host: string;
    tenant: string;
    site: string;
  };
  eightfold?: {
    baseUrl: string;
    domain: string;
    api: 'pcsx' | 'smartapply';
  };
  greenhouse?: string;
  lever?: string;
  ashby?: string;
  smartRecruiters?: string;
}

export const COMPANY_DIRECTORY: CompanyDirectoryEntry[] = [
  {
    name: 'Microsoft',
    domains: ['jobs.careers.microsoft.com', 'careers.microsoft.com', 'apply.careers.microsoft.com'],
    careerUrl: 'https://jobs.careers.microsoft.com/',
    searchUrls: [
      'https://jobs.careers.microsoft.com/global/en/search?q={query}',
      'https://careers.microsoft.com/v2/global/en/universityinternship',
    ],
    eightfold: {
      baseUrl: 'https://apply.careers.microsoft.com',
      domain: 'microsoft.com',
      api: 'pcsx',
    },
  },
  {
    name: 'Google',
    domains: ['careers.google.com', 'www.google.com/about/careers/applications'],
    careerUrl: 'https://www.google.com/about/careers/applications/',
    searchUrls: ['https://www.google.com/about/careers/applications/jobs/results/?q={query}'],
  },
  {
    name: 'Amazon',
    domains: ['amazon.jobs'],
    careerUrl: 'https://www.amazon.jobs/',
    searchUrls: [
      'https://www.amazon.jobs/en/search?base_query={query}',
      'https://www.amazon.jobs/en/search.json?base_query={query}&offset=0&result_limit=25',
    ],
  },
  {
    name: 'Apple',
    domains: ['jobs.apple.com'],
    careerUrl: 'https://jobs.apple.com/',
    searchUrls: ['https://jobs.apple.com/en-us/search?search={query}'],
  },
  {
    name: 'Meta',
    aliases: ['Facebook'],
    domains: ['metacareers.com', 'metacareers.dejobs.org'],
    careerUrl: 'https://www.metacareers.com/',
    searchUrls: ['https://www.metacareers.com/jobs/?q={query}'],
  },
  {
    name: 'NVIDIA',
    domains: ['nvidia.com/en-us/about-nvidia/careers'],
    careerUrl: 'https://www.nvidia.com/en-us/about-nvidia/careers/',
    searchUrls: ['https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?q={query}'],
    workday: {
      host: 'nvidia.wd5.myworkdayjobs.com',
      tenant: 'nvidia',
      site: 'NVIDIAExternalCareerSite',
    },
  },
  {
    name: 'Adobe',
    domains: ['careers.adobe.com'],
    careerUrl: 'https://careers.adobe.com/',
    searchUrls: ['https://careers.adobe.com/us/en/search-results?keywords={query}'],
    workday: { host: 'adobe.wd5.myworkdayjobs.com', tenant: 'adobe', site: 'external_experienced' },
  },
  { name: 'Oracle', domains: ['careers.oracle.com'], careerUrl: 'https://careers.oracle.com/' },
  {
    name: 'Cisco',
    domains: ['jobs.cisco.com'],
    careerUrl: 'https://jobs.cisco.com/',
    searchUrls: ['https://jobs.cisco.com/jobs/SearchJobs/{query}'],
  },
  {
    name: 'Intel',
    domains: ['jobs.intel.com'],
    careerUrl: 'https://jobs.intel.com/',
    searchUrls: ['https://jobs.intel.com/en/search-jobs/{query}/41147/1'],
  },
  {
    name: 'Dell Technologies',
    aliases: ['Dell'],
    domains: ['jobs.dell.com'],
    careerUrl: 'https://jobs.dell.com/',
    searchUrls: ['https://jobs.dell.com/en/search-jobs/{query}/375/1'],
  },
  {
    name: 'HP Inc.',
    aliases: ['HP'],
    domains: ['jobs.hp.com'],
    careerUrl: 'https://jobs.hp.com/',
    searchUrls: ['https://jobs.hp.com/us/en/search-results?keywords={query}'],
  },
  {
    name: 'OpenAI',
    domains: ['openai.com/careers', 'jobs.ashbyhq.com/openai'],
    careerUrl: 'https://openai.com/careers/',
    ashby: 'openai',
  },
  {
    name: 'Anthropic',
    domains: ['anthropic.com/careers', 'boards.greenhouse.io/anthropic'],
    careerUrl: 'https://www.anthropic.com/careers',
    greenhouse: 'anthropic',
  },
  {
    name: 'Cohere',
    domains: ['cohere.com/careers', 'jobs.ashbyhq.com/cohere'],
    careerUrl: 'https://cohere.com/careers',
    ashby: 'cohere',
  },
  {
    name: 'Scale AI',
    domains: ['scale.com/careers', 'boards.greenhouse.io/scaleai'],
    careerUrl: 'https://scale.com/careers',
    greenhouse: 'scaleai',
  },
  {
    name: 'Databricks',
    domains: ['databricks.com/company/careers', 'boards.greenhouse.io/databricks'],
    careerUrl: 'https://www.databricks.com/company/careers',
    greenhouse: 'databricks',
  },
  {
    name: 'Snowflake',
    domains: ['careers.snowflake.com', 'jobs.ashbyhq.com/snowflake'],
    careerUrl: 'https://careers.snowflake.com/',
    ashby: 'snowflake',
  },
  {
    name: 'Palantir Technologies',
    aliases: ['Palantir'],
    domains: ['palantir.com/careers', 'jobs.lever.co/palantir'],
    careerUrl: 'https://www.palantir.com/careers/',
    searchUrls: ['https://www.palantir.com/careers/?search={query}'],
    lever: 'palantir',
  },
  {
    name: 'Salesforce',
    domains: ['salesforce.com/company/careers'],
    careerUrl: 'https://www.salesforce.com/company/careers/',
    searchUrls: ['https://careers.salesforce.com/en/jobs/?search={query}'],
  },
  {
    name: 'ServiceNow',
    domains: ['careers.servicenow.com'],
    careerUrl: 'https://careers.servicenow.com/',
    searchUrls: ['https://careers.servicenow.com/jobs?keyword={query}'],
  },
  {
    name: 'Workday',
    domains: ['workday.com/company/careers'],
    careerUrl: 'https://www.workday.com/en-us/company/careers.html',
  },
  { name: 'SAP', domains: ['jobs.sap.com'], careerUrl: 'https://jobs.sap.com/' },
  {
    name: 'Atlassian',
    domains: ['atlassian.com/company/careers'],
    careerUrl: 'https://www.atlassian.com/company/careers',
    searchUrls: ['https://www.atlassian.com/company/careers/all-jobs?search={query}'],
  },
  {
    name: 'HubSpot',
    domains: ['hubspot.com/careers'],
    careerUrl: 'https://www.hubspot.com/careers',
    searchUrls: ['https://www.hubspot.com/careers/jobs?search={query}'],
  },
  {
    name: 'Intuit',
    domains: ['jobs.intuit.com'],
    careerUrl: 'https://jobs.intuit.com/',
    searchUrls: ['https://jobs.intuit.com/search-jobs/{query}/27595/1'],
  },
  {
    name: 'Zoom Communications',
    aliases: ['Zoom'],
    domains: ['careers.zoom.us'],
    careerUrl: 'https://careers.zoom.us/',
  },
  {
    name: 'Accenture',
    domains: ['accenture.com/us-en/careers'],
    careerUrl: 'https://www.accenture.com/us-en/careers',
  },
  {
    name: 'Deloitte',
    domains: ['deloitte.com/us/en/careers'],
    careerUrl: 'https://www.deloitte.com/us/en/careers.html',
  },
  {
    name: 'PwC',
    domains: ['pwc.com/us/en/careers'],
    careerUrl: 'https://www.pwc.com/us/en/careers.html',
  },
  { name: 'EY', domains: ['ey.com/en_us/careers'], careerUrl: 'https://www.ey.com/en_us/careers' },
  { name: 'KPMG', domains: ['kpmguscareers.com'], careerUrl: 'https://www.kpmguscareers.com/' },
  {
    name: 'Booz Allen Hamilton',
    aliases: ['Booz Allen'],
    domains: ['careers.boozallen.com'],
    careerUrl: 'https://careers.boozallen.com/',
  },
  {
    name: 'Capgemini',
    domains: ['capgemini.com/careers'],
    careerUrl: 'https://www.capgemini.com/careers/',
  },
  { name: 'Slalom', domains: ['slalom.com/careers'], careerUrl: 'https://www.slalom.com/careers' },
  {
    name: 'JPMorgan Chase',
    aliases: ['JPMorgan', 'Chase'],
    domains: ['careers.jpmorgan.com'],
    careerUrl: 'https://careers.jpmorgan.com/',
  },
  {
    name: 'Goldman Sachs',
    domains: ['goldmansachs.com/careers'],
    careerUrl: 'https://www.goldmansachs.com/careers/',
  },
  {
    name: 'Morgan Stanley',
    domains: ['morganstanley.com/people-opportunities'],
    careerUrl: 'https://www.morganstanley.com/people-opportunities/students-graduates',
  },
  {
    name: 'Capital One',
    domains: ['capitalonecareers.com'],
    careerUrl: 'https://www.capitalonecareers.com/',
    searchUrls: ['https://www.capitalonecareers.com/search-jobs/{query}/1732/1'],
    workday: {
      host: 'capitalone.wd12.myworkdayjobs.com',
      tenant: 'capitalone',
      site: 'Capital_One',
    },
  },
  {
    name: 'American Express',
    aliases: ['Amex'],
    domains: ['aexp.eightfold.ai/careers'],
    careerUrl: 'https://aexp.eightfold.ai/careers',
  },
  {
    name: 'Visa',
    domains: ['jobs.smartrecruiters.com/Visa'],
    careerUrl: 'https://jobs.smartrecruiters.com/Visa',
    smartRecruiters: 'Visa',
  },
  {
    name: 'Mastercard',
    domains: ['careers.mastercard.com'],
    careerUrl: 'https://careers.mastercard.com/',
  },
  {
    name: 'Fidelity Investments',
    aliases: ['Fidelity'],
    domains: ['jobs.fidelity.com'],
    careerUrl: 'https://jobs.fidelity.com/',
  },
  {
    name: 'Charles Schwab',
    aliases: ['Schwab'],
    domains: ['jobs.schwabjobs.com'],
    careerUrl: 'https://jobs.schwabjobs.com/',
  },
  {
    name: 'Robinhood',
    domains: ['careers.robinhood.com', 'boards.greenhouse.io/robinhood'],
    careerUrl: 'https://careers.robinhood.com/',
    greenhouse: 'robinhood',
  },
  {
    name: 'SoFi',
    domains: ['sofi.com/careers', 'boards.greenhouse.io/sofi'],
    careerUrl: 'https://www.sofi.com/careers/',
    greenhouse: 'sofi',
  },
  {
    name: 'Stripe',
    domains: ['stripe.com/jobs', 'boards.greenhouse.io/stripe'],
    careerUrl: 'https://stripe.com/jobs',
    greenhouse: 'stripe',
  },
  {
    name: 'Block',
    aliases: ['Square'],
    domains: ['block.xyz/careers', 'boards.greenhouse.io/block'],
    careerUrl: 'https://block.xyz/careers',
    greenhouse: 'block',
  },
  {
    name: 'Plaid',
    domains: ['plaid.com/careers', 'jobs.ashbyhq.com/plaid'],
    careerUrl: 'https://plaid.com/careers/',
    ashby: 'plaid',
  },
  {
    name: 'PayPal',
    domains: ['paypal.com/us/cshelp/jobsearch', 'paypal.eightfold.ai'],
    careerUrl: 'https://www.paypal.com/us/cshelp/jobsearch',
    eightfold: { baseUrl: 'https://paypal.eightfold.ai', domain: 'paypal.com', api: 'pcsx' },
  },
  { name: 'Nike', domains: ['jobs.nike.com'], careerUrl: 'https://jobs.nike.com/' },
  { name: 'PepsiCo', domains: ['pepsicojobs.com'], careerUrl: 'https://www.pepsicojobs.com/' },
  {
    name: 'The Coca-Cola Company',
    aliases: ['Coca-Cola', 'Coke'],
    domains: ['careers.coca-colacompany.com'],
    careerUrl: 'https://careers.coca-colacompany.com/',
  },
  {
    name: 'Johnson & Johnson',
    aliases: ['J&J'],
    domains: ['careers.jnj.com'],
    careerUrl: 'https://careers.jnj.com/',
  },
  {
    name: 'Procter & Gamble',
    aliases: ['P&G'],
    domains: ['pgcareers.com'],
    careerUrl: 'https://www.pgcareers.com/',
  },
  {
    name: 'Unilever',
    domains: ['careers.unilever.com'],
    careerUrl: 'https://careers.unilever.com/',
  },
  {
    name: "L'Oréal",
    aliases: ['L’Oreal', 'Loreal'],
    domains: ['careers.loreal.com'],
    careerUrl: 'https://careers.loreal.com/',
  },
  {
    name: 'Delta Air Lines',
    aliases: ['Delta'],
    domains: ['delta.avature.net/careers'],
    careerUrl: 'https://delta.avature.net/careers',
  },
  {
    name: 'United Airlines',
    aliases: ['United'],
    domains: ['careers.united.com'],
    careerUrl: 'https://careers.united.com/',
  },
  { name: 'American Airlines', domains: ['jobs.aa.com'], careerUrl: 'https://jobs.aa.com/' },
  {
    name: 'Marriott International',
    aliases: ['Marriott'],
    domains: ['careers.marriott.com'],
    careerUrl: 'https://careers.marriott.com/',
  },
  { name: 'Hilton', domains: ['jobs.hilton.com'], careerUrl: 'https://jobs.hilton.com/' },
  { name: 'Walmart', domains: ['careers.walmart.com'], careerUrl: 'https://careers.walmart.com/' },
  { name: 'Target', domains: ['jobs.target.com'], careerUrl: 'https://jobs.target.com/' },
  {
    name: 'Costco Wholesale',
    aliases: ['Costco'],
    domains: ['costco.com/jobs'],
    careerUrl: 'https://www.costco.com/jobs.html',
  },
  {
    name: 'Kaseya',
    domains: ['kaseya.com/careers', 'boards.greenhouse.io/kaseya'],
    careerUrl: 'https://www.kaseya.com/careers/',
    greenhouse: 'kaseya',
  },
  { name: 'Chewy', domains: ['careers.chewy.com'], careerUrl: 'https://careers.chewy.com/' },
  {
    name: 'Ryder System',
    aliases: ['Ryder'],
    domains: ['ryder.com/careers'],
    careerUrl: 'https://www.ryder.com/careers',
  },
  {
    name: 'Royal Caribbean Group',
    aliases: ['Royal Caribbean'],
    domains: ['rclctrac.com'],
    careerUrl: 'https://www.rclctrac.com/',
  },
  {
    name: 'Norwegian Cruise Line Holdings',
    aliases: ['Norwegian Cruise Line', 'NCLH'],
    domains: ['nclhltd.com/careers'],
    careerUrl: 'https://www.nclhltd.com/careers',
  },
  { name: 'Lennar', domains: ['lennar.com/careers'], careerUrl: 'https://www.lennar.com/careers' },
  {
    name: 'Airbnb',
    domains: ['careers.airbnb.com', 'boards.greenhouse.io/airbnb'],
    careerUrl: 'https://careers.airbnb.com/',
    greenhouse: 'airbnb',
  },
  {
    name: 'Coinbase',
    domains: ['coinbase.com/careers', 'boards.greenhouse.io/coinbase'],
    careerUrl: 'https://www.coinbase.com/careers',
    greenhouse: 'coinbase',
  },
  {
    name: 'Discord',
    domains: ['discord.com/jobs', 'boards.greenhouse.io/discord'],
    careerUrl: 'https://discord.com/jobs',
    greenhouse: 'discord',
  },
  {
    name: 'DoorDash',
    domains: ['careers.doordash.com', 'boards.greenhouse.io/doordashusa'],
    careerUrl: 'https://careers.doordash.com/',
    greenhouse: 'doordashusa',
  },
  {
    name: 'Figma',
    domains: ['figma.com/careers', 'boards.greenhouse.io/figma'],
    careerUrl: 'https://www.figma.com/careers/',
    greenhouse: 'figma',
  },
  {
    name: 'Ramp',
    domains: ['ramp.com/careers', 'jobs.ashbyhq.com/ramp'],
    careerUrl: 'https://ramp.com/careers',
    ashby: 'ramp',
  },
  {
    name: 'Perplexity',
    domains: ['perplexity.ai/careers', 'jobs.ashbyhq.com/perplexity'],
    careerUrl: 'https://www.perplexity.ai/careers',
    ashby: 'perplexity',
  },
];
