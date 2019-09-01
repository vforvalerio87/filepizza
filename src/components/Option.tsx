export default function Option({ onChange, value, text }) {
  return (
    <div>
      <input type="checkbox" value={value} onChange={onChange} />
      <label>{text}</label>
    </div>
  );
}
