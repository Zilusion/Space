// src/lib/data/planets.js

/**
 * Данные о планетах Солнечной системы.
 * Источники: NASA Planetary Fact Sheet, Wikipedia (усредненные или общепринятые значения)
 * - Диаметр: Средний диаметр в км.
 * - Масса: Относительно массы Земли (Земля = 1).
 * - Спутники: Количество известных естественных спутников (может меняться с новыми открытиями).
 * - Орбита: Среднее расстояние от Солнца в миллионах км.
 * - Год: Орбитальный период в земных сутках.
 * - Температура: Средняя температура на поверхности (°C) или на уровне облаков для газовых гигантов.
 */
export const planets = [
	{
		id: 'mercury',
		name: 'Меркурий',
		diameter: 4879, // км
		mass: 0.055, // отн. массы Земли
		satellites: 0,
		orbit: 57.9, // млн км
		year: 88, // земных суток
		temperature: 167 // °C (средняя, большие колебания от -173 до 427)
		// image: '/images/planets/mercury.png'
	},
	{
		id: 'venus',
		name: 'Венера',
		diameter: 12104, // км
		mass: 0.815, // отн. массы Земли
		satellites: 0,
		orbit: 108.2, // млн км
		year: 224.7, // земных суток (округлено до 225)
		temperature: 464 // °C (стабильная из-за атмосферы)
		// image: '/images/planets/venus.png'
	},
	{
		id: 'earth',
		name: 'Земля',
		diameter: 12742, // км (средний)
		mass: 1, // отн. массы Земли (по определению)
		satellites: 1,
		orbit: 149.6, // млн км (1 а.е.)
		year: 365.25, // земных суток (округлено до 365)
		temperature: 15 // °C (средняя глобальная)
		// image: '/images/planets/earth.png'
	},
	{
		id: 'mars',
		name: 'Марс',
		diameter: 6779, // км
		mass: 0.107, // отн. массы Земли
		satellites: 2,
		orbit: 227.9, // млн км
		year: 687, // земных суток
		temperature: -63 // °C (средняя)
		// image: '/images/planets/mars.png'
	},
	{
		id: 'jupiter',
		name: 'Юпитер',
		diameter: 139820, // км (средний)
		mass: 317.8, // отн. массы Земли
		satellites: 95, // Количество может обновляться
		orbit: 778.5, // млн км
		year: 4333, // земных суток (~11.9 лет)
		temperature: -110 // °C (на уровне 1 бара в атмосфере)
		// image: '/images/planets/jupiter.png'
	},
	{
		id: 'saturn',
		name: 'Сатурн',
		diameter: 116460, // км (средний)
		mass: 95.2, // отн. массы Земли
		satellites: 146, // Количество может обновляться (лидер на 2023)
		orbit: 1432.0, // млн км
		year: 10759, // земных суток (~29.5 лет)
		temperature: -140 // °C (на уровне 1 бара в атмосфере)
		// image: '/images/planets/saturn.png'
	},
	{
		id: 'uranus',
		name: 'Уран',
		diameter: 50724, // км (средний)
		mass: 14.5, // отн. массы Земли
		satellites: 27,
		orbit: 2871.0, // млн км
		year: 30687, // земных суток (~84 лет)
		temperature: -195 // °C (на уровне 1 бара в атмосфере)
		// image: '/images/planets/uranus.png'
	},
	{
		id: 'neptune',
		name: 'Нептун',
		diameter: 49244, // км (средний - значение из макета корректно)
		mass: 17.1, // отн. массы Земли
		satellites: 14,
		orbit: 4495.1, // млн км (используем стандартное значение NASA, близкое к 4497.1)
		year: 60190, // земных суток (~164.8 лет)
		temperature: -201 // °C (на уровне 1 бара в атмосфере, близко к -200 из макета)
		// image: '/images/planets/neptune.png'
	}
];

// Создаем объект для быстрого доступа к данным планеты по её id
// Этот код остается без изменений, он будет работать с обновленным массивом planets
export const planetsById = planets.reduce((acc, planet) => {
	acc[planet.id] = planet;
	return acc;
}, {});
