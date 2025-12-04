import type { WikiDocument } from '../types/wikirace';

// Mock wiki documents for the game
export const mockWikiDocuments: { [key: string]: WikiDocument } = {
  'doc-1': {
    id: 'doc-1',
    title: '대한민국',
    links: ['doc-2', 'doc-3', 'doc-4', 'doc-5'],
    content: '대한민국은 동아시아에 위치한 국가입니다.'
  },
  'doc-2': {
    id: 'doc-2',
    title: '서울',
    links: ['doc-6', 'doc-7', 'doc-8'],
    content: '서울은 대한민국의 수도입니다.'
  },
  'doc-3': {
    id: 'doc-3',
    title: '한글',
    links: ['doc-9', 'doc-10', 'doc-11'],
    content: '한글은 대한민국의 공식 문자입니다.'
  },
  'doc-4': {
    id: 'doc-4',
    title: '김치',
    links: ['doc-12', 'doc-13'],
    content: '김치는 한국의 대표적인 발효 음식입니다.'
  },
  'doc-5': {
    id: 'doc-5',
    title: '한국어',
    links: ['doc-3', 'doc-14'],
    content: '한국어는 대한민국에서 사용되는 언어입니다.'
  },
  'doc-6': {
    id: 'doc-6',
    title: '한강',
    links: ['doc-15', 'doc-16'],
    content: '한강은 서울을 가로지르는 강입니다.'
  },
  'doc-7': {
    id: 'doc-7',
    title: '경복궁',
    links: ['doc-17', 'doc-18'],
    content: '경복궁은 조선시대의 궁궐입니다.'
  },
  'doc-8': {
    id: 'doc-8',
    title: '강남',
    links: ['doc-19', 'doc-6'],
    content: '강남은 서울의 주요 상업 지역입니다.'
  },
  'doc-9': {
    id: 'doc-9',
    title: '세종대왕',
    links: ['doc-7', 'doc-20'],
    content: '세종대왕은 한글을 창제한 조선의 왕입니다.'
  },
  'doc-10': {
    id: 'doc-10',
    title: '훈민정음',
    links: ['doc-9', 'doc-21'],
    content: '훈민정음은 한글의 원래 이름입니다.'
  },
  'doc-11': {
    id: 'doc-11',
    title: '언어학',
    links: ['doc-5', 'doc-22'],
    content: '언어학은 언어를 과학적으로 연구하는 학문입니다.'
  },
  'doc-12': {
    id: 'doc-12',
    title: '발효',
    links: ['doc-23', 'doc-24'],
    content: '발효는 미생물을 이용한 식품 가공 방법입니다.'
  },
  'doc-13': {
    id: 'doc-13',
    title: '배추',
    links: ['doc-25', 'doc-26'],
    content: '배추는 김치의 주재료입니다.'
  },
  'doc-14': {
    id: 'doc-14',
    title: '한국 문화',
    links: ['doc-4', 'doc-27'],
    content: '한국 문화는 독특한 전통과 현대성을 지닙니다.'
  },
  'doc-15': {
    id: 'doc-15',
    title: '다리',
    links: ['doc-28'],
    content: '한강에는 여러 다리가 있습니다.'
  },
  'doc-16': {
    id: 'doc-16',
    title: '여의도',
    links: ['doc-29'],
    content: '여의도는 한강 위의 섬입니다.'
  },
  'doc-17': {
    id: 'doc-17',
    title: '조선시대',
    links: ['doc-9', 'doc-30'],
    content: '조선시대는 한국의 마지막 왕조입니다.'
  },
  'doc-18': {
    id: 'doc-18',
    title: '건축',
    links: ['doc-31'],
    content: '전통 건축은 한국 문화의 중요한 부분입니다.'
  },
  'doc-19': {
    id: 'doc-19',
    title: 'IT 산업',
    links: ['doc-32', 'doc-33'],
    content: '강남은 IT 산업의 중심지입니다.'
  },
  'doc-20': {
    id: 'doc-20',
    title: '역사',
    links: ['doc-17', 'doc-1'],
    content: '한국은 오랜 역사를 가진 나라입니다.'
  },
  'doc-21': {
    id: 'doc-21',
    title: '문자',
    links: ['doc-3', 'doc-34'],
    content: '문자는 언어를 기록하는 체계입니다.'
  },
  'doc-22': {
    id: 'doc-22',
    title: '학문',
    links: ['doc-35'],
    content: '학문은 지식을 체계적으로 연구합니다.'
  },
  'doc-23': {
    id: 'doc-23',
    title: '미생물',
    links: ['doc-36'],
    content: '미생물은 발효에 필수적입니다.'
  },
  'doc-24': {
    id: 'doc-24',
    title: '식품',
    links: ['doc-4', 'doc-37'],
    content: '식품은 인간의 생존에 필수적입니다.'
  },
  'doc-25': {
    id: 'doc-25',
    title: '채소',
    links: ['doc-38'],
    content: '배추는 대표적인 채소입니다.'
  },
  'doc-26': {
    id: 'doc-26',
    title: '농업',
    links: ['doc-39', 'doc-1'],
    content: '농업은 식량 생산의 기초입니다.'
  },
  'doc-27': {
    id: 'doc-27',
    title: 'K-POP',
    links: ['doc-40', 'doc-41'],
    content: 'K-POP은 한국 문화의 대표적인 콘텐츠입니다.'
  },
  'doc-28': {
    id: 'doc-28',
    title: '교통',
    links: ['doc-2', 'doc-42'],
    content: '교통 인프라는 도시 발전의 핵심입니다.'
  },
  'doc-29': {
    id: 'doc-29',
    title: '국회',
    links: ['doc-1', 'doc-43'],
    content: '국회는 여의도에 위치합니다.'
  },
  'doc-30': {
    id: 'doc-30',
    title: '유교',
    links: ['doc-44'],
    content: '유교는 조선시대의 지배 사상이었습니다.'
  },
  'doc-31': {
    id: 'doc-31',
    title: '예술',
    links: ['doc-45', 'doc-14'],
    content: '건축은 예술의 한 형태입니다.'
  },
  'doc-32': {
    id: 'doc-32',
    title: '스타트업',
    links: ['doc-46'],
    content: '한국은 활발한 스타트업 생태계를 가지고 있습니다.'
  },
  'doc-33': {
    id: 'doc-33',
    title: '기술',
    links: ['doc-47', 'doc-19'],
    content: '기술 발전은 현대 사회의 원동력입니다.'
  },
  'doc-34': {
    id: 'doc-34',
    title: '알파벳',
    links: ['doc-21', 'doc-48'],
    content: '알파벳은 음소 문자의 한 종류입니다.'
  },
  'doc-35': {
    id: 'doc-35',
    title: '대학',
    links: ['doc-49', 'doc-2'],
    content: '대학은 고등 교육 기관입니다.'
  },
  'doc-36': {
    id: 'doc-36',
    title: '생물학',
    links: ['doc-50'],
    content: '생물학은 생명을 연구하는 학문입니다.'
  },
  'doc-37': {
    id: 'doc-37',
    title: '요리',
    links: ['doc-4', 'doc-51'],
    content: '요리는 식품을 조리하는 기술입니다.'
  },
  'doc-38': {
    id: 'doc-38',
    title: '건강',
    links: ['doc-52'],
    content: '채소는 건강에 좋습니다.'
  },
  'doc-39': {
    id: 'doc-39',
    title: '경제',
    links: ['doc-1', 'doc-53'],
    content: '농업은 경제의 중요한 부분입니다.'
  },
  'doc-40': {
    id: 'doc-40',
    title: '음악',
    links: ['doc-54', 'doc-31'],
    content: '음악은 보편적인 예술 형태입니다.'
  },
  'doc-41': {
    id: 'doc-41',
    title: '한류',
    links: ['doc-27', 'doc-14'],
    content: '한류는 한국 문화의 세계적 확산입니다.'
  },
  'doc-42': {
    id: 'doc-42',
    title: '지하철',
    links: ['doc-2', 'doc-55'],
    content: '서울 지하철은 세계적인 교통 시스템입니다.'
  },
  'doc-43': {
    id: 'doc-43',
    title: '정치',
    links: ['doc-1', 'doc-29'],
    content: '정치는 국가 운영의 핵심입니다.'
  },
  'doc-44': {
    id: 'doc-44',
    title: '철학',
    links: ['doc-22', 'doc-56'],
    content: '유교는 동양 철학의 중요한 흐름입니다.'
  },
  'doc-45': {
    id: 'doc-45',
    title: '미술',
    links: ['doc-31', 'doc-57'],
    content: '미술은 시각적 예술입니다.'
  },
  'doc-46': {
    id: 'doc-46',
    title: '기업',
    links: ['doc-39', 'doc-32'],
    content: '스타트업은 혁신적인 기업 형태입니다.'
  },
  'doc-47': {
    id: 'doc-47',
    title: '과학',
    links: ['doc-36', 'doc-58'],
    content: '과학은 자연을 체계적으로 연구합니다.'
  },
  'doc-48': {
    id: 'doc-48',
    title: '언어',
    links: ['doc-5', 'doc-11'],
    content: '언어는 의사소통의 도구입니다.'
  },
  'doc-49': {
    id: 'doc-49',
    title: '교육',
    links: ['doc-35', 'doc-59'],
    content: '교육은 지식 전달의 과정입니다.'
  },
  'doc-50': {
    id: 'doc-50',
    title: '자연',
    links: ['doc-60', 'doc-47'],
    content: '자연은 생물학 연구의 대상입니다.'
  },
  'doc-51': {
    id: 'doc-51',
    title: '레스토랑',
    links: ['doc-37', 'doc-2'],
    content: '서울에는 다양한 레스토랑이 있습니다.'
  },
  'doc-52': {
    id: 'doc-52',
    title: '의학',
    links: ['doc-61', 'doc-36'],
    content: '의학은 건강을 연구하는 학문입니다.'
  },
  'doc-53': {
    id: 'doc-53',
    title: '무역',
    links: ['doc-39', 'doc-62'],
    content: '한국은 무역 강국입니다.'
  },
  'doc-54': {
    id: 'doc-54',
    title: '악기',
    links: ['doc-40', 'doc-63'],
    content: '악기는 음악을 만드는 도구입니다.'
  },
  'doc-55': {
    id: 'doc-55',
    title: '도시',
    links: ['doc-2', 'doc-28'],
    content: '도시는 인구가 밀집된 지역입니다.'
  },
  'doc-56': {
    id: 'doc-56',
    title: '사상',
    links: ['doc-44', 'doc-20'],
    content: '철학은 사상을 다루는 학문입니다.'
  },
  'doc-57': {
    id: 'doc-57',
    title: '전시',
    links: ['doc-45', 'doc-64'],
    content: '미술관에서는 전시를 개최합니다.'
  },
  'doc-58': {
    id: 'doc-58',
    title: '실험',
    links: ['doc-47', 'doc-65'],
    content: '과학은 실험을 통해 발전합니다.'
  },
  'doc-59': {
    id: 'doc-59',
    title: '학교',
    links: ['doc-49', 'doc-55'],
    content: '학교는 교육의 장소입니다.'
  },
  'doc-60': {
    id: 'doc-60',
    title: '환경',
    links: ['doc-50', 'doc-66'],
    content: '환경 보호는 중요한 과제입니다.'
  },
  'doc-61': {
    id: 'doc-61',
    title: '병원',
    links: ['doc-52', 'doc-2'],
    content: '병원은 의료 서비스를 제공합니다.'
  },
  'doc-62': {
    id: 'doc-62',
    title: '항구',
    links: ['doc-53', 'doc-67'],
    content: '항구는 무역의 관문입니다.'
  },
  'doc-63': {
    id: 'doc-63',
    title: '전통 악기',
    links: ['doc-54', 'doc-14'],
    content: '한국에는 독특한 전통 악기가 있습니다.'
  },
  'doc-64': {
    id: 'doc-64',
    title: '박물관',
    links: ['doc-57', 'doc-20'],
    content: '박물관은 역사와 문화를 전시합니다.'
  },
  'doc-65': {
    id: 'doc-65',
    title: '연구',
    links: ['doc-58', 'doc-35'],
    content: '연구는 새로운 지식을 창출합니다.'
  },
  'doc-66': {
    id: 'doc-66',
    title: '기후',
    links: ['doc-60', 'doc-1'],
    content: '한국은 사계절이 뚜렷합니다.'
  },
  'doc-67': {
    id: 'doc-67',
    title: '부산',
    links: ['doc-62', 'doc-1'],
    content: '부산은 한국의 대표적인 항구 도시입니다.'
  }
};

// Predefined game scenarios with varying difficulties
export const gameScenarios = [
  { start: 'doc-1', goal: 'doc-9', difficulty: '쉬움' },
  { start: 'doc-1', goal: 'doc-27', difficulty: '보통' },
  { start: 'doc-2', goal: 'doc-40', difficulty: '보통' },
  { start: 'doc-1', goal: 'doc-47', difficulty: '어려움' },
  { start: 'doc-3', goal: 'doc-67', difficulty: '어려움' },
];

export function getRandomScenario() {
  return gameScenarios[Math.floor(Math.random() * gameScenarios.length)];
}
