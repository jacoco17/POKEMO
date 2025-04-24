export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
}

export interface TeamMember extends Pokemon {
  addedAt: string;
}

export interface Battle {
  id: number;
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  winner: Pokemon;
  date: string;
} 