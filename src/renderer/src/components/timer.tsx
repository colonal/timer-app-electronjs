import { useEffect, useState } from 'react'
import * as yup from 'yup'
import alarm from '../assets/sounds/alarm-sound.mp3'
import InputField from './InputField'

type TimerProps = {
  isOverlay?: boolean
}

type TimerValues = {
  hours: number
  minutes: number
  seconds: number
}

type TimerErrors = {
  hours: string
  minutes: string
  seconds: string
}

const timerSchema = yup.object({
  hours: yup.number().min(0, 'Hours cannot be negative').required('Required'),
  minutes: yup
    .number()
    .min(0, 'Minutes cannot be negative')
    .max(59, 'Must be less than 60')
    .required('Required'),
  seconds: yup
    .number()
    .min(0, 'Seconds cannot be negative')
    .max(59, 'Must be less than 60')
    .required('Required')
})

function Timer({ isOverlay }: TimerProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const audio = new Audio(alarm)

  const [values, setValues] = useState<TimerValues>({
    hours: 0,
    minutes: 1,
    seconds: 0
  })

  const [errors, setErrors] = useState<TimerErrors>({
    hours: '',
    minutes: '',
    seconds: ''
  })

  const handleChange =
    (field: keyof TimerValues) =>
      (e: React.ChangeEvent<HTMLInputElement>): void => {
        setValues({ ...values, [field]: parseInt(e.target.value || '0') })
      }

  const validateInputs = (): boolean => {
    try {
      timerSchema.validateSync(values, { abortEarly: false })
      setErrors({ hours: '', minutes: '', seconds: '' })
      return true
    } catch (err) {
      const newErrors: TimerErrors = { hours: '', minutes: '', seconds: '' }
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((error) => {
          const path = error.path as keyof TimerErrors
          if (path in newErrors) {
            newErrors[path] = error.message
          }
        })
      }

      setErrors(newErrors)
      return false
    }
  }

  const handleStart = (): void => {
    if (validateInputs()) {
      console.log('Valid Timer:', values)
      setIsEditing(false)
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    if (isActive) {
      intervalId = setInterval(() => {
        setValues((prevValues) => {
          const { hours, minutes, seconds } = prevValues

          if (seconds > 0) {
            return { hours, minutes, seconds: seconds - 1 }
          } else if (minutes > 0) {
            return { hours, minutes: minutes - 1, seconds: 59 }
          } else if (hours > 0) {
            return { hours: hours - 1, minutes: 59, seconds: 59 }
          } else {
            audio.play()
            clearInterval(intervalId)
            setIsActive(false)
            return prevValues
          }
        })
      }, 1000)
    }

    return (): void => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isActive])

  return (
    <div>
      {isEditing ? (
        <div className="flex justify-center">
          <div>
            <h3>Timer {isOverlay ? 'Overlay' : ''}</h3>
            <InputField
              label="Hours"
              value={values.hours}
              onChange={handleChange('hours')}
              error={errors.hours}
            />
            <InputField
              label="Minutes"
              value={values.minutes}
              onChange={handleChange('minutes')}
              error={errors.minutes}
            />
            <InputField
              label="Seconds"
              value={values.seconds}
              onChange={handleChange('seconds')}
              error={errors.seconds}
            />
            <button
              className="bg-blue-500  text-stone-200 px-20 py-1 rounded-xl text-xl mt-1 mt-1"
              onClick={handleStart}
            >
              &#10003;
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center">
            <h1 className="text-green-500 text-6xl">
              {values.hours.toString().padStart(2, '0')}:
              {values.minutes.toString().padStart(2, '0')}:
              {values.seconds.toString().padStart(2, '0')}
            </h1>
          </div>
          <div
            id="timer-button"
            className={
              !isOverlay
                ? 'text-stone-500 flex justify-center bg-black bg-opacity-10 rounded-xl'
                : 'hidden'
            }
          >
            {isActive ? (
              <>
                <button
                  className="start text-5xl text-yellow-500 m-2"
                  onClick={() => setIsActive(false)}
                >
                  ||
                </button>
                <button
                  className="start text-5xl text-red-500 m-2"
                  onClick={() => {
                    setIsActive(false)
                    setValues({ hours: 0, minutes: 0, seconds: 0 })
                  }}
                >
                  &#9632;
                </button>
              </>
            ) : (
              <>
                <button
                  className="start text-5xl text-green-500 m-2"
                  onClick={() => setIsActive(true)}
                >
                  &#9658;
                </button>
                <button
                  className="start text-4xl text-yellow-500 m-2"
                  onClick={() => setIsEditing(true)}
                >
                  &#9998;
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Timer
