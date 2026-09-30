import { PracticeProblem, QuizQuestion } from '../types/physics';

export const SPEED_DATA = [
  { medium: { en: 'Air (gas)', id: 'Udara (gas)' }, speed: 330, type: 'gas', color: '#38bdf8' },
  { medium: { en: 'Water (liquid)', id: 'Air (cairan)' }, speed: 1500, type: 'liquid', color: '#0284c7' },
  { medium: { en: 'Iron (solid metal)', id: 'Besi (logam padat)' }, speed: 5000, type: 'solid', color: '#f59e0b' },
  { medium: { en: 'Granite (solid stone)', id: 'Granit (batu padat)' }, speed: 5400, type: 'solid', color: '#ea580c' },
];

export const FREQUENCY_SPECTRUM = [
  {
    range: '< 20 Hz',
    name: { en: 'Infrasound', id: 'Infrasonik' },
    description: {
      en: 'Below human hearing. Produced by vibrating rulers, seismic waves, elephants, and whales.',
      id: 'Di bawah batas pendengaran manusia. Dihasilkan oleh mistar yang bergetar lambat, gelombang seismik gempa, gajah, dan paus.'
    },
    examples: ['Vibrating ruler', 'Earthquake waves', 'Elephants'],
    color: 'from-amber-500/20 to-amber-600/20 text-amber-300 border-amber-500/30'
  },
  {
    range: '20 Hz – 20,000 Hz (20 kHz)',
    name: { en: 'Audible Sound (Human Ear)', id: 'Bunyi Audiosonik (Manusia)' },
    description: {
      en: 'The normal range of human hearing. Highest sensitivity is between 1,000 Hz and 4,000 Hz.',
      id: 'Rentang pendengaran normal manusia sehat. Kepekaan tertinggi berada di antara 1.000 Hz dan 4.000 Hz.'
    },
    examples: ['Human speech', 'Musical instruments', 'Everyday sounds'],
    color: 'from-emerald-500/20 to-teal-600/20 text-emerald-300 border-emerald-500/30'
  },
  {
    range: '> 20,000 Hz (20 kHz)',
    name: { en: 'Ultrasound', id: 'Ultrasonik' },
    description: {
      en: 'Above human hearing. Detected by bats, dolphins, and dogs. Widely used in medicine (foetus scanning) and SONAR depth sounding.',
      id: 'Di atas batas pendengaran manusia. Mampu didengar kelelawar, lumba-lumba, dan anjing. Digunakan dalam medis (USG janin) dan SONAR kapal laut.'
    },
    examples: ['Dog whistle', 'Bat echolocation', 'Medical ultrasound scan', 'SONAR ship'],
    color: 'from-blue-500/20 to-indigo-600/20 text-cyan-300 border-cyan-500/30'
  }
];

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: 'p14-1-1',
    slide: 7,
    topic: '14.1 What Is Sound?',
    prompt: {
      en: 'Read each sentence and state the meaning of each underlined term:\n(a) Sound is a longitudinal wave.\n(b) Sound is transmitted as a series of compressions and rarefactions in air.',
      id: 'Bacalah setiap kalimat dan jelaskan arti dari setiap istilah yang digarisbawahi:\n(a) Bunyi adalah gelombang longitudinal.\n(b) Bunyi dirambatkan sebagai rangkaian rapatan (compressions) dan renggangan (rarefactions) di udara.'
    },
    sampleAnswer: {
      en: '(a) Longitudinal wave: A wave where the direction of particle vibration is parallel to the direction of wave travel / energy transfer.\n(b) Compressions: Regions of high air pressure where air particles are pushed close together. Rarefactions: Regions of low air pressure where air particles are spread further apart.',
      id: '(a) Gelombang longitudinal: Gelombang di mana arah getaran partikel medium sejajar dengan arah rambat gelombang / transfer energi.\n(b) Rapatan (compression): Daerah bertekanan udara lebih tinggi di mana partikel udara saling merapat. Renggangan (rarefaction): Daerah bertekanan udara lebih rendah di mana partikel saling merenggang.'
    },
    keyPoints: {
      en: ['Vibration parallel to propagation', 'Compressions = high pressure / bunched particles', 'Rarefactions = low pressure / spread particles'],
      id: ['Getaran partikel sejajar arah rambat', 'Rapatan = tekanan tinggi / partikel berdekatan', 'Renggangan = tekanan rendah / partikel berjauhan']
    }
  },
  {
    id: 'p14-1-2',
    slide: 7,
    topic: '14.1 Audible Range',
    prompt: {
      en: 'A vibrating source produces ultrasound at a frequency of 40 kHz. Is this frequency within the audible range of the human ear? Give your reason.',
      id: 'Sebuah sumber getar menghasilkan gelombang ultrasonik pada frekuensi 40 kHz. Apakah frekuensi ini berada dalam rentang pendengaran telinga manusia? Jelaskan alasannya.'
    },
    sampleAnswer: {
      en: 'No, 40 kHz (40,000 Hz) is NOT within the human audible range. The audible range of the human ear is between 20 Hz and 20,000 Hz (20 kHz). 40 kHz is higher than 20 kHz, making it inaudible ultrasound.',
      id: 'Tidak, 40 kHz (40.000 Hz) TIDAK berada dalam jangkauan telinga manusia. Rentang pendengaran manusia normal adalah 20 Hz hingga 20.000 Hz (20 kHz). Nilai 40 kHz berada di atas batas pendengaran manusia (disebut ultrasonik).'
    },
    keyPoints: {
      en: ['Human hearing is 20 Hz - 20 kHz', '40 kHz > 20 kHz', 'Categorized as ultrasound'],
      id: ['Pendengaran manusia 20 Hz - 20 kHz', '40 kHz > 20 kHz', 'Termasuk kategori ultrasonik']
    }
  },
  {
    id: 'p14-2-1',
    slide: 12,
    topic: '14.2 Sound in Space',
    prompt: {
      en: 'Can sound travel directly from one spaceship to another one nearby in space? Why?',
      id: 'Dapatkah bunyi merambat secara langsung dari satu pesawat luar angkasa ke pesawat lain yang berada di dekatnya? Mengapa?'
    },
    sampleAnswer: {
      en: 'No. Space is a vacuum (contains no air or material particles). Sound is a mechanical wave that requires a material medium (solid, liquid, or gas) to propagate via particle collisions.',
      id: 'Tidak bisa. Ruang angkasa adalah ruang hampa (vakum) tanpa partikel materi. Bunyi adalah gelombang mekanik yang mutlak membutuhkan medium materi (padat, cair, atau gas) untuk merambatkan getaran antarpartikel.'
    },
    keyPoints: {
      en: ['Sound needs a medium', 'Space is a vacuum', 'No particles to vibrate'],
      id: ['Bunyi butuh medium materi', 'Luar angkasa hampa udara (vakum)', 'Tidak ada partikel untuk merambatkan getaran']
    }
  },
  {
    id: 'p14-2-2',
    slide: 12,
    topic: '14.2 Lightning and Thunder Calculation',
    prompt: {
      en: 'A woman standing 1.00 km away from a storm hears the sound of thunder 3 s after she sees a flash of lightning. Calculate the speed of sound in air in m/s.',
      id: 'Seorang wanita berdiri pada jarak 1,00 km dari badai dan mendengar suara guntur 3 detik setelah melihat kilatan petir. Hitunglah kecepatan bunyi di udara dalam satuan m/s.'
    },
    sampleAnswer: {
      en: 'Distance d = 1.00 km = 1000 m. Time t = 3 s. Speed v = distance / time = 1000 m / 3 s ≈ 333.3 m/s (or 333 m/s to 3 s.f.).',
      id: 'Jarak d = 1,00 km = 1.000 m. Waktu t = 3 s. Kecepatan bunyi v = d / t = 1.000 m / 3 s ≈ 333,3 m/s (atau 333 m/s).'
    },
    keyPoints: {
      en: ['Convert 1.00 km = 1000 m', 'Formula v = d / t', 'Result ~ 333 m/s'],
      id: ['Konversi 1,00 km = 1.000 m', 'Rumus v = d / t', 'Hasil v ≈ 333 m/s']
    }
  },
  {
    id: 'p14-3-1',
    slide: 19,
    topic: '14.3 Multiple Echoes in Hall',
    prompt: {
      en: 'If you shout in an empty hall, you will not hear a distinct single echo. Instead, you will hear many echoes (reverberation). Explain why.',
      id: 'Jika Anda berteriak di dalam gedung aula kosong, Anda tidak akan mendengar satu gema yang jelas, melainkan dengungan berkepanjangan / banyak pantulan. Mengapa?'
    },
    sampleAnswer: {
      en: 'An empty hall has multiple hard reflecting surfaces (opposite walls, ceiling, bare floor). The sound waves reflect back and forth multiple times from these different surfaces with slightly different path lengths and arrival times, causing overlapping reflections called reverberation.',
      id: 'Gedung aula kosong memiliki banyak permukaan keras pemantul (dinding depan-belakang, kiri-kanan, langit-langit, dan lantai). Gelombang bunyi memantul bolak-balik berulang kali dengan jarak tempuh dan waktu tiba yang berbeda-beda, sehingga suara tumpang-tindih (gaung/reverberasi).'
    },
    keyPoints: {
      en: ['Multiple reflecting walls/surfaces', 'Different travel paths & arrival times', 'Causes overlapping reverberation'],
      id: ['Banyak permukaan dinding pemantul', 'Jarak tempuh & waktu tiba berbeda', 'Menghasilkan gaung bertumpuk']
    }
  },
  {
    id: 'p14-3-2',
    slide: 19,
    topic: '14.3 SONAR Echo Calculation',
    prompt: {
      en: 'A pulse of sound is transmitted from a ship towards the seabed. If the echo is received after 1.0 s, calculate the depth of the sea, given that the speed of sound in water is 1500 m/s.',
      id: 'Pulsa bunyi ultrasonik dipancarkan dari kapal menuju dasar laut. Jika gema pantulan diterima kembali setelah 1,0 s, hitunglah kedalaman laut jika cepat rambat bunyi dalam air adalah 1.500 m/s.'
    },
    sampleAnswer: {
      en: 'The sound travels to the seabed and back, so total distance = 2d. Using d = (v × t) / 2 = (1500 m/s × 1.0 s) / 2 = 750 m.',
      id: 'Gelombang bunyi menempuh perjalanan bolak-balik (pergi dan pulang), sehingga jarak total = 2d. Kedalaman d = (v × t) / 2 = (1.500 m/s × 1,0 s) / 2 = 750 meter.'
    },
    keyPoints: {
      en: ['Sound travels to seabed and back (2d)', 'Formula d = (v * t) / 2', 'Depth = 750 m'],
      id: ['Bunyi menempuh jarak bolak-balik 2d', 'Rumus d = (v * t) / 2', 'Kedalaman = 750 m']
    }
  },
  {
    id: 'p14-3-3',
    slide: 19,
    topic: '14.3 Ultrasound vs X-rays in Medicine',
    prompt: {
      en: 'Why is ultrasound preferred to X-rays for prenatal scanning, although both types of waves can be used to obtain images of internal organs?',
      id: 'Mengapa ultrasonografi (USG) lebih disukai daripada sinar-X untuk pemeriksaan kandungan ibu hamil, padahal kedua jenis gelombang dapat menampilkan organ dalam?'
    },
    sampleAnswer: {
      en: 'Ultrasound consists of high-frequency sound waves which are non-ionizing and harmless to delicate developing foetal tissue. In contrast, X-rays are high-energy ionizing electromagnetic radiation that can cause cell mutations and birth defects.',
      id: 'Ultrasonik adalah gelombang mekanik berfrekuensi tinggi yang aman (non-ionisasi) dan tidak merusak sel janin. Sebaliknya, sinar-X adalah radiasi pengion berenergi tinggi yang dapat merusak DNA janin dan menimbulkan risiko cacat kelahiran.'
    },
    keyPoints: {
      en: ['Ultrasound is non-ionizing and safe for foetus', 'X-rays are ionizing radiation', 'X-rays risk cell damage & mutation'],
      id: ['USG bersifat non-ionisasi & aman untuk janin', 'Sinar-X adalah radiasi pengion berbahaya', 'Sinar-X berisiko mutasi DNA']
    }
  },
  {
    id: 'p14-4-1',
    slide: 23,
    topic: '14.4 Pitch and Loudness Associations',
    prompt: {
      en: 'Of these quantities — speed, frequency, wavelength, and amplitude — which is associated with:\n(a) the loudness of a sound?\n(b) the pitch of a sound?',
      id: 'Di antara besaran-besaran berikut — kecepatan, frekuensi, panjang gelombang, dan amplitudo — manakah yang berhubungan dengan:\n(a) kenyaringan / keras lemahnya bunyi (loudness)?\n(b) tinggi rendahnya nada bunyi (pitch)?'
    },
    sampleAnswer: {
      en: '(a) Loudness is associated with Amplitude (greater amplitude = louder sound).\n(b) Pitch is associated with Frequency (higher frequency = higher pitch).',
      id: '(a) Loudness (kenyaringan bunyi) berhubungan dengan Amplitudo gelombang (makin besar amplitudo, makin nyaring suaranya).\n(b) Pitch (tinggi nada) berhubungan dengan Frekuensi gelombang (makin tinggi frekuensi, makin tinggi nada suaranya).'
    },
    keyPoints: {
      en: ['Loudness -> Amplitude', 'Pitch -> Frequency'],
      id: ['Kenyaringan (Loudness) -> Amplitudo', 'Tinggi Nada (Pitch) -> Frekuensi']
    }
  },
  {
    id: 'p14-4-2',
    slide: 23,
    topic: '14.4 Mosquito vs Bullfrog',
    prompt: {
      en: 'Compare in terms of loudness and pitch the sounds made by a mosquito flying near your ear and the croaking of a bullfrog.',
      id: 'Bandingkan dari segi kenyaringan (loudness) dan tinggi nada (pitch) antara bunyi dengung nyamuk di dekat telinga dengan suara dengkuran katak lembu (bullfrog).'
    },
    sampleAnswer: {
      en: '• Mosquito: High pitch (wings beat at rapid 500-600 Hz) but soft/low loudness (small amplitude vibration).\n• Bullfrog: Low pitch (deep croak, low frequency ~100-200 Hz) but loud (large amplitude vocal sac resonance).',
      id: '• Nyamuk: Nada tinggi (high pitch, frekuensi kepakan sayap cepat ~500-600 Hz) namun bersuara lirih/lemah (amplitudo kecil).\n• Katak Lembu: Nada rendah (low pitch, frekuensi rendah bersuara berat ~100-200 Hz) namun cukup keras/nyaring (amplitudo getaran kantung suara besar).'
    },
    keyPoints: {
      en: ['Mosquito: High pitch, low loudness', 'Bullfrog: Low pitch, high loudness'],
      id: ['Nyamuk: Pitch tinggi, loudness rendah', 'Katak: Pitch rendah, loudness tinggi']
    }
  }
];

export const WRAP_UP_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    section: '14.1 Production & Nature',
    sourceSlide: 5,
    question: {
      en: 'Why is sound classified as a longitudinal wave?',
      id: 'Mengapa bunyi diklasifikasikan sebagai gelombang longitudinal?'
    },
    options: {
      en: [
        'Because air particles vibrate parallel to the direction of wave travel',
        'Because air particles vibrate perpendicular to the direction of wave travel',
        'Because it travels at the speed of light',
        'Because it can travel through empty space without particles'
      ],
      id: [
        'Karena partikel medium bergetar sejajar dengan arah rambat gelombang',
        'Karena partikel medium bergetar tegak lurus dengan arah rambat gelombang',
        'Karena bunyi merambat secepat kecepatan cahaya',
        'Karena bunyi dapat merambat melalui ruang hampa tanpa partikel'
      ]
    },
    correctAnswer: 0,
    explanation: {
      en: 'In a longitudinal wave, the vibrations of the particles in the medium are parallel to the direction in which the wave energy travels (Slide 5).',
      id: 'Pada gelombang longitudinal, arah getaran partikel medium selalu sejajar dengan arah rambat energi gelombang (Slide 5).'
    }
  },
  {
    id: 'q2',
    section: '14.1 Compressions & Rarefactions',
    sourceSlide: 5,
    question: {
      en: 'What occurs at a region of compression in a sound wave?',
      id: 'Apa yang terjadi pada daerah rapatan (compression) pada gelombang bunyi?'
    },
    options: {
      en: [
        'Air pressure is higher than normal and particles are bunched together',
        'Air pressure is lower than normal and particles are spread far apart',
        'The air particles stop moving completely',
        'Sound changes frequency and pitch'
      ],
      id: [
        'Tekanan udara lebih tinggi dari normal dan partikel saling merapat',
        'Tekanan udara lebih rendah dari normal dan partikel saling merenggang',
        'Partikel udara berhenti bergetar sama sekali',
        'Bunyi mengalami perubahan frekuensi dan nada'
      ]
    },
    correctAnswer: 0,
    explanation: {
      en: 'Compressions are regions of high pressure where air layers are pushed together; rarefactions are regions of low pressure where air layers expand (Slide 5).',
      id: 'Rapatan adalah daerah bertekanan tinggi di mana lapisan partikel berhimpitan; sedangkan renggangan adalah daerah bertekanan rendah (Slide 5).'
    }
  },
  {
    id: 'q3',
    section: '14.2 Transmission in Medium',
    sourceSlide: 9,
    question: {
      en: 'In the bell jar experiment, what happens to the sound of the bell as the air is pumped out to a vacuum?',
      id: 'Pada eksperimen sungkup bel (bell jar), apa yang terjadi pada bunyi bel ketika udara dipompa keluar hingga hampa?'
    },
    options: {
      en: [
        'The sound becomes faint and disappears completely, although the striker is still hitting the bell',
        'The sound becomes louder because there is no air resistance',
        'The pitch of the sound increases to ultrasound',
        'The striker stops hitting the bell'
      ],
      id: [
        'Suara bel semakin melemah hingga hilang total, meskipun pemukul masih tampak memukul bel',
        'Suara bel menjadi semakin keras karena tidak ada hambatan udara',
        'Tinggi nada bel naik hingga menjadi ultrasonik',
        'Pemukul bel berhenti memukul lonceng secara otomatis'
      ]
    },
    correctAnswer: 0,
    explanation: {
      en: 'The bell jar experiment proves sound requires a medium. In a vacuum, no particles exist to transmit vibration energy (Slide 9).',
      id: 'Eksperimen sungkup bel membuktikan bahwa bunyi membutuhkan medium. Tanpa partikel di ruang hampa, getaran tidak dapat diteruskan ke telinga kita (Slide 9).'
    }
  },
  {
    id: 'q4',
    section: '14.2 Speed of Sound',
    sourceSlide: 10,
    question: {
      en: 'Which list arranges the speed of sound correctly from slowest to fastest?',
      id: 'Urutan manakah yang benar mengenai cepat rambat bunyi dari yang paling lambat ke paling cepat?'
    },
    options: {
      en: [
        'Air (gas) < Water (liquid) < Iron (solid)',
        'Iron (solid) < Water (liquid) < Air (gas)',
        'Water (liquid) < Air (gas) < Iron (solid)',
        'Air (gas) = Water (liquid) = Iron (solid)'
      ],
      id: [
        'Udara (gas) < Air (cair) < Besi (padat)',
        'Besi (padat) < Air (cair) < Udara (gas)',
        'Air (cair) < Udara (gas) < Besi (padat)',
        'Udara (gas) = Air (cair) = Besi (padat)'
      ]
    },
    correctAnswer: 0,
    explanation: {
      en: 'In general, sound travels fastest in solids (~5000 m/s), slower in liquids (~1500 m/s), and slowest in gases (~330 m/s) because particles in solids are tightly bound (Slide 10).',
      id: 'Bunyi merambat paling cepat pada zat padat (~5000 m/s), lebih lambat pada zat cair (~1500 m/s), dan paling lambat pada gas (~330 m/s) karena kerapatan partikel zat padat paling tinggi (Slide 10).'
    }
  },
  {
    id: 'q5',
    section: '14.3 Echo & SONAR',
    sourceSlide: 18,
    question: {
      en: 'A ship sends a sonar pulse into seawater (v = 1500 m/s). An echo returns from the seabed in 0.4 seconds. How deep is the seabed?',
      id: 'Sebuah kapal memancarkan pulsa sonar ke air laut (v = 1.500 m/s). Gema diterima kembali dari dasar laut setelah 0,4 detik. Berapakah kedalaman dasar laut tersebut?'
    },
    options: {
      en: ['300 m', '600 m', '150 m', '3000 m'],
      id: ['300 m', '600 m', '150 m', '3.000 m']
    },
    correctAnswer: 0,
    explanation: {
      en: 'd = (v × t) / 2 = (1500 m/s × 0.4 s) / 2 = 600 / 2 = 300 m (Slide 18 Worked Example 14A).',
      id: 'd = (v × t) / 2 = (1.500 m/s × 0,4 s) / 2 = 600 / 2 = 300 meter (Sesuai Contoh Soal 14A di Slide 18).'
    }
  },
  {
    id: 'q6',
    section: '14.4 Pitch and Loudness',
    sourceSlide: 21,
    question: {
      en: 'On a Cathode Ray Oscilloscope (C.R.O), what visual change indicates a sound has a HIGHER PITCH and GREATER LOUDNESS?',
      id: 'Pada layar Osiloskop Sinar Katoda (C.R.O), perubahan visual apa yang menunjukkan bunyi memiliki NADA LEBIH TINGGI dan LEBIH NYARING?'
    },
    options: {
      en: [
        'More wave cycles packed across the screen (higher frequency) AND taller wave peaks (greater amplitude)',
        'Fewer wave cycles across the screen AND flatter waves',
        'Higher peaks only, with no change in cycle count',
        'Waves shift entirely to the right with zero change in height'
      ],
      id: [
        'Gelombang lebih rapat / banyak siklus (frekuensi tinggi) DAN puncak gelombang lebih tinggi (amplitudo besar)',
        'Siklus gelombang lebih renggang DAN gelombang semakin ceper/datar',
        'Hanya puncak gelombang yang meninggi tanpa perubahan kerapatan',
        'Gelombang bergeser ke kanan tanpa perubahan tinggi dan bentuk'
      ]
    },
    correctAnswer: 0,
    explanation: {
      en: 'Pitch depends on Frequency (more cycles per second), while Loudness depends on Amplitude (taller crests and troughs) (Slide 21 & 22).',
      id: 'Tinggi nada ditentukan oleh Frekuensi (banyak gelombang per satuan waktu), sedangkan kenyaringan suara ditentukan oleh Amplitudo (tinggi puncak gelombang) (Slide 21 & 22).'
    }
  }
];
