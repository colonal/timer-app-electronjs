type InputFieldProps = {
  label?: string
  value?: number
  placeHolder?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

function InputField(props: InputFieldProps): JSX.Element {
  return (
    <div className="text-3xl" style={{ marginBottom: '1rem' }}>
      <label className="text-stone-300">{props.label}:</label>
      <input
        type="number"
        placeholder={props.placeHolder}
        value={props.value}
        onChange={props.onChange}
        className="w-20 bg-transparent text-blue-400"
      />
      {props.error && <p style={{ color: 'red' }}>{props.error}</p>}
    </div>
  )
}

export default InputField
