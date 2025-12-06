import type { WikiDocument } from '../types/wikirace';

// Mock wiki documents for the game - Enhanced connectivity version
export const mockWikiDocuments: { [key: string]: WikiDocument } = {
  'doc-1': {
    id: 'doc-1',
    title: '대한민국',
    links: ['doc-2', 'doc-3', 'doc-4', 'doc-5', 'doc-20', 'doc-39', 'doc-43', 'doc-66'],
    content: '대한민국은 동아시아에 위치한 국가입니다. 수도는 서울이며, 한글을 사용합니다.'
  },
  'doc-2': {
    id: 'doc-2',
    title: '서울',
    links: ['doc-1', 'doc-6', 'doc-7', 'doc-8', 'doc-28', 'doc-42', 'doc-51', 'doc-55'],
    content: '서울은 대한민국의 수도입니다. 한강이 흐르고 경복궁 같은 역사적 건축물이 있습니다.'
  },
  'doc-3': {
    id: 'doc-3',
    title: '한글',
    links: ['doc-1', 'doc-5', 'doc-9', 'doc-10', 'doc-11', 'doc-21', 'doc-48'],
    content: '한글은 대한민국의 공식 문자입니다. 세종대왕이 창제한 훈민정음이 그 기원입니다.'
  },
  'doc-4': {
    id: 'doc-4',
    title: '김치',
    links: ['doc-1', 'doc-12', 'doc-13', 'doc-14', 'doc-24', 'doc-37'],
    content: '김치는 한국의 대표적인 발효 음식입니다. 배추와 다양한 양념을 사용합니다.'
  },
  'doc-5': {
    id: 'doc-5',
    title: '한국어',
    links: ['doc-1', 'doc-3', 'doc-11', 'doc-14', 'doc-48'],
    content: '한국어는 대한민국에서 사용되는 언어입니다. 한글로 표기됩니다.'
  },
  'doc-6': {
    id: 'doc-6',
    title: '한강',
    links: ['doc-2', 'doc-8', 'doc-15', 'doc-16', 'doc-60', 'doc-66'],
    content: '한강은 서울을 가로지르는 강입니다. 여의도와 강남을 연결하는 다리들이 있습니다.'
  },
  'doc-7': {
    id: 'doc-7',
    title: '경복궁',
    links: ['doc-2', 'doc-9', 'doc-17', 'doc-18', 'doc-20', 'doc-31'],
    content: '경복궁은 조선시대의 궁궐입니다. 세종대왕과 관련된 역사가 있습니다.'
  },
  'doc-8': {
    id: 'doc-8',
    title: '강남',
    links: ['doc-2', 'doc-6', 'doc-19', 'doc-32', 'doc-33', 'doc-55'],
    content: '강남은 서울의 주요 상업 지역입니다. IT 산업과 스타트업이 많습니다.'
  },
  'doc-9': {
    id: 'doc-9',
    title: '세종대왕',
    links: ['doc-3', 'doc-7', 'doc-10', 'doc-17', 'doc-20'],
    content: '세종대왕은 한글을 창제한 조선의 왕입니다. 경복궁에서 집무를 보셨습니다.'
  },
  'doc-10': {
    id: 'doc-10',
    title: '훈민정음',
    links: ['doc-3', 'doc-9', 'doc-21', 'doc-48'],
    content: '훈민정음은 한글의 원래 이름입니다. 세종대왕이 창제하였습니다.'
  },
  'doc-11': {
    id: 'doc-11',
    title: '언어학',
    links: ['doc-3', 'doc-5', 'doc-22', 'doc-48', 'doc-47'],
    content: '언어학은 언어를 과학적으로 연구하는 학문입니다. 한국어와 한글을 연구합니다.'
  },
  'doc-12': {
    id: 'doc-12',
    title: '발효',
    links: ['doc-4', 'doc-23', 'doc-24', 'doc-36'],
    content: '발효는 미생물을 이용한 식품 가공 방법입니다. 김치 제조에 필수적입니다.'
  },
  'doc-13': {
    id: 'doc-13',
    title: '배추',
    links: ['doc-4', 'doc-25', 'doc-26', 'doc-38'],
    content: '배추는 김치의 주재료입니다. 대표적인 채소입니다.'
  },
  'doc-14': {
    id: 'doc-14',
    title: '한국 문화',
    links: ['doc-1', 'doc-4', 'doc-27', 'doc-31', 'doc-41', 'doc-63'],
    content: '한국 문화는 독특한 전통과 현대성을 지닙니다. K-POP과 김치가 대표적입니다.'
  },
  'doc-15': {
    id: 'doc-15',
    title: '다리',
    links: ['doc-6', 'doc-28', 'doc-18', 'doc-55'],
    content: '한강에는 여러 다리가 있습니다. 교통과 건축의 중요한 요소입니다.'
  },
  'doc-16': {
    id: 'doc-16',
    title: '여의도',
    links: ['doc-6', 'doc-29', 'doc-43', 'doc-2'],
    content: '여의도는 한강 위의 섬입니다. 국회가 위치해 있습니다.'
  },
  'doc-17': {
    id: 'doc-17',
    title: '조선시대',
    links: ['doc-1', 'doc-7', 'doc-9', 'doc-20', 'doc-30', 'doc-56'],
    content: '조선시대는 한국의 마지막 왕조입니다. 세종대왕이 다스렸던 시대입니다.'
  },
  'doc-18': {
    id: 'doc-18',
    title: '건축',
    links: ['doc-7', 'doc-15', 'doc-31', 'doc-45', 'doc-55'],
    content: '전통 건축은 한국 문화의 중요한 부분입니다. 경복궁이 대표적입니다.'
  },
  'doc-19': {
    id: 'doc-19',
    title: 'IT 산업',
    links: ['doc-8', 'doc-32', 'doc-33', 'doc-46', 'doc-47'],
    content: '강남은 IT 산업의 중심지입니다. 스타트업과 기술 기업들이 많습니다.'
  },
  'doc-20': {
    id: 'doc-20',
    title: '역사',
    links: ['doc-1', 'doc-7', 'doc-9', 'doc-17', 'doc-56', 'doc-64'],
    content: '한국은 오랜 역사를 가진 나라입니다. 조선시대와 세종대왕의 업적이 있습니다.'
  },
  'doc-21': {
    id: 'doc-21',
    title: '문자',
    links: ['doc-3', 'doc-10', 'doc-34', 'doc-48', 'doc-11'],
    content: '문자는 언어를 기록하는 체계입니다. 한글과 알파벳이 대표적입니다.'
  },
  'doc-22': {
    id: 'doc-22',
    title: '학문',
    links: ['doc-11', 'doc-35', 'doc-44', 'doc-47', 'doc-49'],
    content: '학문은 지식을 체계적으로 연구합니다. 언어학, 철학, 과학이 있습니다.'
  },
  'doc-23': {
    id: 'doc-23',
    title: '미생물',
    links: ['doc-12', 'doc-36', 'doc-47', 'doc-50'],
    content: '미생물은 발효에 필수적입니다. 생물학에서 연구합니다.'
  },
  'doc-24': {
    id: 'doc-24',
    title: '식품',
    links: ['doc-4', 'doc-12', 'doc-37', 'doc-38', 'doc-51'],
    content: '식품은 인간의 생존에 필수적입니다. 김치와 발효 식품이 포함됩니다.'
  },
  'doc-25': {
    id: 'doc-25',
    title: '채소',
    links: ['doc-13', 'doc-26', 'doc-38', 'doc-60'],
    content: '배추는 대표적인 채소입니다. 농업으로 재배됩니다.'
  },
  'doc-26': {
    id: 'doc-26',
    title: '농업',
    links: ['doc-1', 'doc-13', 'doc-25', 'doc-39', 'doc-60'],
    content: '농업은 식량 생산의 기초입니다. 채소와 배추를 재배합니다.'
  },
  'doc-27': {
    id: 'doc-27',
    title: 'K-POP',
    links: ['doc-14', 'doc-40', 'doc-41', 'doc-54', 'doc-31'],
    content: 'K-POP은 한국 문화의 대표적인 콘텐츠입니다. 음악과 한류의 중심입니다.'
  },
  'doc-28': {
    id: 'doc-28',
    title: '교통',
    links: ['doc-2', 'doc-15', 'doc-42', 'doc-55', 'doc-8'],
    content: '교통 인프라는 도시 발전의 핵심입니다. 서울에는 다리와 지하철이 있습니다.'
  },
  'doc-29': {
    id: 'doc-29',
    title: '국회',
    links: ['doc-1', 'doc-16', 'doc-43', 'doc-39'],
    content: '국회는 여의도에 위치합니다. 정치의 중심지입니다.'
  },
  'doc-30': {
    id: 'doc-30',
    title: '유교',
    links: ['doc-17', 'doc-44', 'doc-56', 'doc-20'],
    content: '유교는 조선시대의 지배 사상이었습니다. 철학과 역사에 영향을 주었습니다.'
  },
  'doc-31': {
    id: 'doc-31',
    title: '예술',
    links: ['doc-14', 'doc-18', 'doc-27', 'doc-40', 'doc-45', 'doc-57'],
    content: '건축은 예술의 한 형태입니다. 음악, 미술과 함께 한국 문화를 이룹니다.'
  },
  'doc-32': {
    id: 'doc-32',
    title: '스타트업',
    links: ['doc-8', 'doc-19', 'doc-33', 'doc-46', 'doc-39'],
    content: '한국은 활발한 스타트업 생태계를 가지고 있습니다. 강남에 많이 위치합니다.'
  },
  'doc-33': {
    id: 'doc-33',
    title: '기술',
    links: ['doc-8', 'doc-19', 'doc-32', 'doc-47', 'doc-58'],
    content: '기술 발전은 현대 사회의 원동력입니다. IT 산업과 과학의 기반입니다.'
  },
  'doc-34': {
    id: 'doc-34',
    title: '알파벳',
    links: ['doc-21', 'doc-48', 'doc-11', 'doc-5'],
    content: '알파벳은 음소 문자의 한 종류입니다. 문자와 언어 체계의 일부입니다.'
  },
  'doc-35': {
    id: 'doc-35',
    title: '대학',
    links: ['doc-2', 'doc-22', 'doc-49', 'doc-59', 'doc-65'],
    content: '대학은 고등 교육 기관입니다. 서울에 많은 대학이 있습니다.'
  },
  'doc-36': {
    id: 'doc-36',
    title: '생물학',
    links: ['doc-12', 'doc-23', 'doc-47', 'doc-50', 'doc-52'],
    content: '생물학은 생명을 연구하는 학문입니다. 미생물과 자연을 연구합니다.'
  },
  'doc-37': {
    id: 'doc-37',
    title: '요리',
    links: ['doc-4', 'doc-24', 'doc-51', 'doc-14'],
    content: '요리는 식품을 조리하는 기술입니다. 김치와 한국 음식이 유명합니다.'
  },
  'doc-38': {
    id: 'doc-38',
    title: '건강',
    links: ['doc-13', 'doc-24', 'doc-25', 'doc-52', 'doc-60'],
    content: '채소는 건강에 좋습니다. 식품과 의학의 중요한 요소입니다.'
  },
  'doc-39': {
    id: 'doc-39',
    title: '경제',
    links: ['doc-1', 'doc-26', 'doc-29', 'doc-32', 'doc-46', 'doc-53'],
    content: '농업은 경제의 중요한 부분입니다. 대한민국의 경제는 다양한 산업으로 구성됩니다.'
  },
  'doc-40': {
    id: 'doc-40',
    title: '음악',
    links: ['doc-27', 'doc-31', 'doc-54', 'doc-63', 'doc-14'],
    content: '음악은 보편적인 예술 형태입니다. K-POP과 전통 악기가 있습니다.'
  },
  'doc-41': {
    id: 'doc-41',
    title: '한류',
    links: ['doc-14', 'doc-27', 'doc-40', 'doc-1'],
    content: '한류는 한국 문화의 세계적 확산입니다. K-POP과 음악이 중심입니다.'
  },
  'doc-42': {
    id: 'doc-42',
    title: '지하철',
    links: ['doc-2', 'doc-28', 'doc-55', 'doc-8'],
    content: '서울 지하철은 세계적인 교통 시스템입니다. 강남과 서울을 연결합니다.'
  },
  'doc-43': {
    id: 'doc-43',
    title: '정치',
    links: ['doc-1', 'doc-16', 'doc-29', 'doc-39'],
    content: '정치는 국가 운영의 핵심입니다. 국회에서 이루어집니다.'
  },
  'doc-44': {
    id: 'doc-44',
    title: '철학',
    links: ['doc-22', 'doc-30', 'doc-56', 'doc-11'],
    content: '유교는 동양 철학의 중요한 흐름입니다. 학문과 사상의 기초입니다.'
  },
  'doc-45': {
    id: 'doc-45',
    title: '미술',
    links: ['doc-18', 'doc-31', 'doc-57', 'doc-64', 'doc-14'],
    content: '미술은 시각적 예술입니다. 건축과 함께 문화를 이룹니다.'
  },
  'doc-46': {
    id: 'doc-46',
    title: '기업',
    links: ['doc-19', 'doc-32', 'doc-39', 'doc-53'],
    content: '스타트업은 혁신적인 기업 형태입니다. 경제의 중요한 부분입니다.'
  },
  'doc-47': {
    id: 'doc-47',
    title: '과학',
    links: ['doc-11', 'doc-22', 'doc-23', 'doc-33', 'doc-36', 'doc-58', 'doc-65'],
    content: '과학은 자연을 체계적으로 연구합니다. 생물학과 기술의 기반입니다.'
  },
  'doc-48': {
    id: 'doc-48',
    title: '언어',
    links: ['doc-3', 'doc-5', 'doc-10', 'doc-11', 'doc-21', 'doc-34'],
    content: '언어는 의사소통의 도구입니다. 한국어와 한글이 있습니다.'
  },
  'doc-49': {
    id: 'doc-49',
    title: '교육',
    links: ['doc-22', 'doc-35', 'doc-59', 'doc-65'],
    content: '교육은 지식 전달의 과정입니다. 대학과 학교에서 이루어집니다.'
  },
  'doc-50': {
    id: 'doc-50',
    title: '자연',
    links: ['doc-23', 'doc-36', 'doc-47', 'doc-60', 'doc-66'],
    content: '자연은 생물학 연구의 대상입니다. 환경과 기후를 포함합니다.'
  },
  'doc-51': {
    id: 'doc-51',
    title: '레스토랑',
    links: ['doc-2', 'doc-24', 'doc-37', 'doc-4'],
    content: '서울에는 다양한 레스토랑이 있습니다. 김치와 요리를 제공합니다.'
  },
  'doc-52': {
    id: 'doc-52',
    title: '의학',
    links: ['doc-36', 'doc-38', 'doc-47', 'doc-61'],
    content: '의학은 건강을 연구하는 학문입니다. 생물학과 과학의 응용입니다.'
  },
  'doc-53': {
    id: 'doc-53',
    title: '무역',
    links: ['doc-1', 'doc-39', 'doc-46', 'doc-62', 'doc-67'],
    content: '한국은 무역 강국입니다. 부산 항구를 통해 경제 활동을 합니다.'
  },
  'doc-54': {
    id: 'doc-54',
    title: '악기',
    links: ['doc-27', 'doc-40', 'doc-63', 'doc-31'],
    content: '악기는 음악을 만드는 도구입니다. 전통 악기와 현대 악기가 있습니다.'
  },
  'doc-55': {
    id: 'doc-55',
    title: '도시',
    links: ['doc-2', 'doc-8', 'doc-15', 'doc-28', 'doc-42', 'doc-59', 'doc-67'],
    content: '도시는 인구가 밀집된 지역입니다. 서울과 부산이 대표적입니다.'
  },
  'doc-56': {
    id: 'doc-56',
    title: '사상',
    links: ['doc-17', 'doc-20', 'doc-30', 'doc-44'],
    content: '철학은 사상을 다루는 학문입니다. 유교와 역사에 영향을 주었습니다.'
  },
  'doc-57': {
    id: 'doc-57',
    title: '전시',
    links: ['doc-31', 'doc-45', 'doc-64', 'doc-14'],
    content: '미술관에서는 전시를 개최합니다. 예술과 문화를 보여줍니다.'
  },
  'doc-58': {
    id: 'doc-58',
    title: '실험',
    links: ['doc-33', 'doc-47', 'doc-65', 'doc-36'],
    content: '과학은 실험을 통해 발전합니다. 연구와 기술의 기초입니다.'
  },
  'doc-59': {
    id: 'doc-59',
    title: '학교',
    links: ['doc-35', 'doc-49', 'doc-55', 'doc-2'],
    content: '학교는 교육의 장소입니다. 도시에 많은 학교가 있습니다.'
  },
  'doc-60': {
    id: 'doc-60',
    title: '환경',
    links: ['doc-6', 'doc-25', 'doc-26', 'doc-38', 'doc-50', 'doc-66'],
    content: '환경 보호는 중요한 과제입니다. 자연과 기후와 관련됩니다.'
  },
  'doc-61': {
    id: 'doc-61',
    title: '병원',
    links: ['doc-2', 'doc-38', 'doc-52', 'doc-55'],
    content: '병원은 의료 서비스를 제공합니다. 서울과 도시에 위치합니다.'
  },
  'doc-62': {
    id: 'doc-62',
    title: '항구',
    links: ['doc-53', 'doc-67', 'doc-39', 'doc-55'],
    content: '항구는 무역의 관문입니다. 부산이 대표적인 항구 도시입니다.'
  },
  'doc-63': {
    id: 'doc-63',
    title: '전통 악기',
    links: ['doc-14', 'doc-40', 'doc-54', 'doc-31'],
    content: '한국에는 독특한 전통 악기가 있습니다. 한국 문화와 음악의 일부입니다.'
  },
  'doc-64': {
    id: 'doc-64',
    title: '박물관',
    links: ['doc-20', 'doc-45', 'doc-57', 'doc-7', 'doc-14'],
    content: '박물관은 역사와 문화를 전시합니다. 경복궁과 함께 문화재를 보존합니다.'
  },
  'doc-65': {
    id: 'doc-65',
    title: '연구',
    links: ['doc-22', 'doc-35', 'doc-47', 'doc-49', 'doc-58'],
    content: '연구는 새로운 지식을 창출합니다. 대학과 과학에서 이루어집니다.'
  },
  'doc-66': {
    id: 'doc-66',
    title: '기후',
    links: ['doc-1', 'doc-6', 'doc-50', 'doc-60'],
    content: '한국은 사계절이 뚜렷합니다. 환경과 자연에 영향을 줍니다.'
  },
  'doc-67': {
    id: 'doc-67',
    title: '부산',
    links: ['doc-1', 'doc-55', 'doc-62', 'doc-53'],
    content: '부산은 한국의 대표적인 항구 도시입니다. 무역과 경제의 중심지입니다.'
  }
};

// Predefined game scenarios with varying difficulties
export const gameScenarios = [
  // 쉬움 - 2-3 단계로 도달 가능
  { start: 'doc-1', goal: 'doc-2', difficulty: '쉬움', optimalSteps: 1, hint: '대한민국 → 서울' },
  { start: 'doc-1', goal: 'doc-9', difficulty: '쉬움', optimalSteps: 2, hint: '대한민국 → 한글 → 세종대왕' },
  { start: 'doc-2', goal: 'doc-7', difficulty: '쉬움', optimalSteps: 1, hint: '서울 → 경복궁' },
  { start: 'doc-3', goal: 'doc-10', difficulty: '쉬움', optimalSteps: 1, hint: '한글 → 훈민정음' },
  { start: 'doc-4', goal: 'doc-13', difficulty: '쉬움', optimalSteps: 1, hint: '김치 → 배추' },

  // 보통 - 3-5 단계로 도달 가능
  { start: 'doc-1', goal: 'doc-27', difficulty: '보통', optimalSteps: 2, hint: '대한민국 → 한국 문화 → K-POP' },
  { start: 'doc-2', goal: 'doc-40', difficulty: '보통', optimalSteps: 4, hint: '서울에서 음악까지' },
  { start: 'doc-1', goal: 'doc-31', difficulty: '보통', optimalSteps: 3, hint: '대한민국 → 한국 문화 → 예술' },
  { start: 'doc-7', goal: 'doc-44', difficulty: '보통', optimalSteps: 3, hint: '경복궁 → 조선시대 → 유교 → 철학' },
  { start: 'doc-8', goal: 'doc-47', difficulty: '보통', optimalSteps: 2, hint: '강남 → IT 산업 → 과학' },
  { start: 'doc-3', goal: 'doc-22', difficulty: '보통', optimalSteps: 2, hint: '한글 → 언어학 → 학문' },

  // 어려움 - 5-7 단계로 도달 가능
  { start: 'doc-1', goal: 'doc-47', difficulty: '어려움', optimalSteps: 5, hint: '대한민국에서 과학까지의 긴 여정' },
  { start: 'doc-3', goal: 'doc-67', difficulty: '어려움', optimalSteps: 6, hint: '한글에서 부산까지' },
  { start: 'doc-4', goal: 'doc-65', difficulty: '어려움', optimalSteps: 6, hint: '김치에서 연구까지' },
  { start: 'doc-9', goal: 'doc-62', difficulty: '어려움', optimalSteps: 7, hint: '세종대왕에서 항구까지' },
  { start: 'doc-14', goal: 'doc-52', difficulty: '어려움', optimalSteps: 5, hint: '한국 문화에서 의학까지' },

  // 매우 어려움 - 7+ 단계, 연결이 복잡함
  { start: 'doc-4', goal: 'doc-33', difficulty: '매우 어려움', optimalSteps: 8, hint: '김치에서 기술까지의 먼 길' },
  { start: 'doc-10', goal: 'doc-61', difficulty: '매우 어려움', optimalSteps: 8, hint: '훈민정음에서 병원까지' },
  { start: 'doc-13', goal: 'doc-54', difficulty: '매우 어려움', optimalSteps: 9, hint: '배추에서 악기까지의 도전' },
  { start: 'doc-25', goal: 'doc-43', difficulty: '매우 어려움', optimalSteps: 7, hint: '채소에서 정치까지' },
];

export function getRandomScenario() {
  return gameScenarios[Math.floor(Math.random() * gameScenarios.length)];
}

export function getScenarioByDifficulty(difficulty: string) {
  const filtered = gameScenarios.filter(s => s.difficulty === difficulty);
  return filtered[Math.floor(Math.random() * filtered.length)];
}
