import { FaBed, FaLandmark }  from "react-icons/fa";
import { IoMdCafe } from "react-icons/io";
import { HiLocationMarker} from "react-icons/hi"
import { MdOutlineRestaurant } from "react-icons/md"

export default function Hashtag() {
    const categories = [
        { key: 'accomodation', label: '숙소', icon: FaBed },
        { key: 'cafe', label: '카페', icon: IoMdCafe },
        { key: 'exhibition', label: '전시관', icon: FaLandmark },
        { key: 'landmark', label: '관광지', icon: HiLocationMarker },
        { key: 'restaurant', label: '식당', icon: MdOutlineRestaurant },
    ]

    // const Icon = categories.icon
    return (
        <div className="gap-2 px-5">
            {categories.map(({ key, label, icon:Icon}) => (
                <div key={key} className="inline-flex items-center mr-1 px-2 rounded-full text-sm font-medium bg-charcoal text-background-light">
                    {Icon && <Icon alt={label} className="size-5 gap-1 pr-1"/>}
                    {label}
                </div>
            ))}</div>
    )
}