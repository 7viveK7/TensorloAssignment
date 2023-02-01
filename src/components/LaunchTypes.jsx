import { AiOutlineFilter } from "react-icons/ai";

export function AllLanches({ onChange, value }) {
  return (
    <div>
      <AiOutlineFilter style={{ marginRight: 10 }} />
      <select className="dropdown" value={value} onChange={onChange}>
        <option disabled>Select</option>
        <option value="all">All Lanches</option>
        <option value="upcoming">Up Comming Lanches</option>
        <option value="true">Successful Lunches</option>
        <option value="false">Faild Lanches</option>
      </select>
    </div>
  );
}
