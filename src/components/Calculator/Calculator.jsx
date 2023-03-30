/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react'

const PROXY_TYPES = {
  ipv4: {
    name: 'Серверные IPv4',
    price: 60,
    countries: ['australia', 'austria'],
    rentalPeriods: ['1-day', '7-days', '1-month'],
  },
  ipv6: {
    name: 'Серверные IPv6',
    price: 0.51,
    countries: ['austria', 'uk'],
    rentalPeriods: ['3-days', '1-month', '1-year'],
  },
  mobile: {
    name: 'Мобильные',
    price: 160,
    countries: ['italy', 'india'],
    rentalPeriods: ['1-day', '7-days', '1-month'],
  },
  default: {
    name: 'default',
    price: 0,
    countries: [],
    rentalPeriods: [],
  },
}

const COUNTRIES = {
  australia: {
    name: 'Австралия',
    price: 236,
  },
  austria: {
    name: 'Австрия',
    price: 236,
  },
  uk: {
    name: 'Великобритания',
    price: 5.4,
  },
  italy: {
    name: 'Италия',
    price: 287,
  },
  india: {
    name: 'Индия',
    price: 98.4,
  },
}

const RENTAL_PERIODS = {
  '1-day': {
    name: '1 день',
    multiplier: 1,
  },
  '3-days': {
    name: '3 дня',
    multiplier: 3,
  },
  '7-days': {
    name: '7 дней',
    multiplier: 7,
  },
  '1-month': {
    name: '1 месяц',
    multiplier: 30,
  },
  '1-year': {
    name: '1 год',
    multiplier: 365,
  },
}

function calculatePrice(proxyType, country, rentalPeriod, proxyCount) {
  const proxyTypeData = PROXY_TYPES[proxyType]
  const countryData = country ? COUNTRIES[country] : null
  const rentalPeriodData = rentalPeriod ? RENTAL_PERIODS[rentalPeriod] : null

  if (!rentalPeriodData || !rentalPeriodData.multiplier) {
    return 0
  }

  const basePrice = proxyTypeData ? proxyTypeData.price + rentalPeriodData.multiplier : 0
  const countryPrice = countryData ? countryData.price + rentalPeriodData.multiplier : 0

  return (basePrice + countryPrice) * proxyCount
}

export function Calculator() {
  const [proxyType, setProxyType] = useState('default')
  const [country, setCountry] = useState('')
  const [rentalPeriod, setRentalPeriod] = useState('')
  const [price, setPrice] = useState(0)
  const [proxyCount, setProxyCount] = useState(1)
  const [isFirstFieldFilled, setIsFirstFieldFilled] = useState(false)

  function handleProxyTypeChange(event) {
    setProxyType(event.target.value)
    setIsFirstFieldFilled(true)
    setCountry('')
    setRentalPeriod('')
    setPrice(0)
  }

  function handleCountryChange(event) {
    setCountry(event.target.value)
    setPrice(calculatePrice(proxyType, event.target.value, rentalPeriod, proxyCount))
  }

  function handleRentalPeriodChange(event) {
    setRentalPeriod(event.target.value)
    setPrice(calculatePrice(proxyType, country, event.target.value, proxyCount))
  }

  function handleProxyCountChange(event) {
    setProxyCount(event.target.value)
    setPrice(calculatePrice(proxyType, country, rentalPeriod, event.target.value))
  }

  function handleEmptyProxyType(event) {
    if (!proxyType || proxyType !== 'default') {
      setIsFirstFieldFilled(false)
    } else if (!event.target.value) {
      setCountry('')
      setRentalPeriod('')
      setPrice(0)
    }
  }

  function handleClear() {
    setProxyType('default')
    setCountry('')
    setRentalPeriod('')
    setPrice(0)
    setProxyCount(1)
    setIsFirstFieldFilled(false)
  }

  useEffect(() => {
    if (country && rentalPeriod && proxyType) {
      setPrice(calculatePrice(proxyType, country, rentalPeriod, proxyCount))
    }
  }, [country, rentalPeriod, proxyType, proxyCount])

  return (
    <div className="container bg-dark rounded" style={{ maxWidth: '60%', padding: '20px' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="row justify-content-between">
            <div className="col-md-5">
              <h3 className="text-white mb-4">Калькулятор прокси</h3>
            </div>
            <div className="col-md-5">
              <p className="text-right text-white">
                Цена:
                {' '}
                {price.toFixed(0)}
                {' '}
                ₽
              </p>
            </div>
          </div>
          <hr className="text-white" />
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="proxy-type" className="text-white">Тип прокси:</label>
                <select id="proxy-type" className="form-control" value={proxyType} onChange={handleProxyTypeChange} onChangeCapture={handleEmptyProxyType} required>
                  <option value="default" disabled defaultValue className="text-secondary">Выберите тип прокси</option>
                  <option value="ipv4">{PROXY_TYPES.ipv4.name}</option>
                  <option value="ipv6">{PROXY_TYPES.ipv6.name}</option>
                  <option value="mobile">{PROXY_TYPES.mobile.name}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="country" className="text-white">Страна:</label>
                <select id="country" className="form-control" value={country} onChange={handleCountryChange} disabled={!isFirstFieldFilled} required>
                  <option value="" disabled>Выберите страну</option>
                  {PROXY_TYPES[proxyType]?.countries.map((countryCode) => (
                    <option key={countryCode} value={countryCode}>
                      {COUNTRIES[countryCode].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="rental-period" className="text-white">Срок аренды:</label>
                <select id="rental-period" className="form-control" value={rentalPeriod} onChange={handleRentalPeriodChange} disabled={!isFirstFieldFilled} required>
                  <option value="" disabled>Выберите срок аренды</option>
                  {PROXY_TYPES[proxyType].rentalPeriods.map((period) => (
                    <option key={period} value={period}>
                      {RENTAL_PERIODS[period].name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="proxy-count" className="text-white">Количество прокси:</label>
                <input type="number" id="proxy-count" className="form-control" value={proxyCount} onChange={handleProxyCountChange} />
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button type="button" className="btn btn-light" onClick={handleClear}>Очистить</button>
          </div>
        </div>
      </div>
    </div>
  )
}
