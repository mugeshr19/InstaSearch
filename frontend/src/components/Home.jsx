import { useState,useMemo } from "react";
import axios from "axios";


function Home(){
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    function debounce(func,delay){
        let timer;
        return function (...args){
            clearTimeout(timer);
            timer = setTimeout(()=> {
                func(...args);
            }, delay);
        };
    }

    const fetchUsers = async (value) => {

        if (!value) {
        setUsers([]);
        return;
        }
        try {
        const res = await axios.get(
            `http://localhost:3000/api/search?q=${value}`
        );
        setUsers(res.data);

        } catch (err) {
        console.log(err);

        }

    };

    const debouncedSearch = useMemo(
        ()=> debounce(fetchUsers,300),[]
    );

    const handleSearch =async(e) =>{
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    
    return(
        <div>
            <input type="text" placeholder="Search username..." value={query} onChange={handleSearch} style={{width: "50%", padding: "10px",fontSize: "16px"}} />
            <button>Search</button>
            <div>

            {users.map((user) => (

                <div key={user._id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    <strong>{user.username}</strong>

                    <p>Followers: {user.followers}</p>
                </div>

            ))}

            </div>
        </div>
    );
}

export default Home;