import React, { useState, useEffect } from "react";
import axios from 'axios';

const GuestBook = () => {
  const [guestName, setGuestName] = useState("");
  const [comment, setComment] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [namePlaceholder, setNamePlaceholder] = useState("Name");

  const [commentsFetched, setCommentsFetched] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () =>{
    try{
        // const data = await axios.get('https://cws.auckland.ac.nz/gas/api/Comments');
        // const comments = await data.data;
        // setCommentsFetched(comments);
        //console.log(commentsFetched);
        document.getElementById("iframeComment").src = 'https://cws.auckland.ac.nz/gas/api/Comments';

    } catch(err){
        console.log(err)
    } 
 }





  const handleCommentSubmit = (e) =>{
    e.preventDefault();
    const c = { guestName, comment};
    if(c.comment){
        //fetch post request
        fetch('https://cws.auckland.ac.nz/gas/api/Comment',{
          method: 'POST',
          body: JSON.stringify({
              comment: c.comment,
              name: c.guestName
          }),
          headers: {
              "Content-Type": "application/json",
              'Accept': 'text/plain'
          }
      })
      .then((data)=>{
          return data.text();
      }).then((textData)=>{     
      var frameObj = document.getElementById('iframeComment');
      frameObj.innerHTML +=textData;
      fetchComments();
      
      })
    }
    
    setGuestName('');
    setComment('');
    console.log(c);
  }
  const handleCheckBoxChange =(e) =>{
    setIsChecked(!isChecked);
    if (!isChecked){
      setGuestName("")
      setNamePlaceholder("Anonymous")
    } 
    else{
      setNamePlaceholder("Name");
    }
  }

  useEffect(()=>{
    fetchComments();
    },[])


  
  return (
    <div className="pt-[78px] pb-[2%] px-[2%] md:px-[18%] h-full flex flex-col gap-[2%]">
      <h3 className="mt-[2%] text-[1.5rem] relative">Comments</h3>
      {loading ? (
        <div className="w-full h-[57%]  absolute left-0 top-[20%]">
          <div className="bubble speech">
            <div className="dots-container">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
        
      
      ):
      null}
      <iframe src="" className="w-full h-[57%] border" title="Iframe Comments" id="iframeComment" onLoad={() => setLoading(false)}></iframe>
      
      <div className="border rounded-[0.25rem] px-[8%] py-[2%] bg-[#eeeeee]">
        <h4>Leave a Comment</h4>
        <form className="flex flex-col gap-[1rem]" onSubmit={handleCommentSubmit}>
          <input
            className="border  rounded px-[2%] py-[1%]"
            type="text"
            placeholder={namePlaceholder}
            name="name"
            disabled={isChecked}
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <label>
            <input type="checkbox"  onChange={handleCheckBoxChange}/>Anonymous
          </label>
          
          
          <textarea
            className="border  rounded resize-none px-[2%] py-[1%]"
            required
            rows="4"
            placeholder="Leave comment here"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button type="submit" className="border rounded bg-[#bbbbbb]" onInput={handleCommentSubmit}>
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestBook;
