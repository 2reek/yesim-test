export interface Country {
  id: string;
  country: string;
  iso: string;
  url: string;
  search?: string[];
  classic_info?: {
    new: boolean;
    popular: boolean | null;
    price_per_gb: string;
    price_per_day: string;
  };
  psg_info?: {
    coins: string | number | null;
  };
  package_included?: Array<{ id: string }>;
}
