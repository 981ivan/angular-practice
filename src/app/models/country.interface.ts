export interface CountryInterface {
  name: Name;
  currencies: Currencies;
  capital: string[];
}

export interface Currencies {
  XOF: XOF;
}

export interface XOF {
  name: string;
  symbol: string;
}

export interface Name {
  common: string;
  official: string;
  nativeName: NativeName;
}

export interface NativeName {
  fra: Fra;
}

export interface Fra {
  official: string;
  common: string;
}
