'use client'
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";




export default function Pagination({totalPages} : {totalPages: number}) {
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1;
    const {replace} = useRouter()

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathName}?${params.toString()}`;
    }

    function handleButtonPress() {
        if (currentPage >= totalPages) return;
        replace(createPageURL(currentPage +1));
    }

    return (
    <div>
      <button
        type="button"
        onClick={handleButtonPress}
        disabled={currentPage >= totalPages} // optional
      >
        Load More
      </button>
    </div>
    )
}