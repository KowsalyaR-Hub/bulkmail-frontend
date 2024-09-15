import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx"

function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0]
    console.log(file)

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemail = emailList.map(function (item) { return item.A })
      console.log(totalemail)
      setEmailList(totalemail)

    }

    reader.readAsBinaryString(file);
  }

  function send() {
    setstatus(true)
    axios.post("http://localhost:5000/sendemail", { msg: msg, emailList: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email Sent Successfully")
          setstatus(false)
        }
        else {
          alert("Failed")
          setstatus(false)
        }
      })
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white text-center py-10 shadow-xl fade-in rounded-b-lg">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide mb-4">BulkMail</h1>
        <p className="text-base sm:text-lg lg:text-xl font-light">
          Manage and send bulk emails effortlessly with our clean and intuitive interface.
        </p>
      </div>

      <div className="bg-blue-700/80 backdrop-blur-md flex flex-col items-center text-white px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-12 fade-in rounded-xl shadow-lg mt-6 mx-4 sm:mx-8 md:mx-20 lg:mx-32">
        <textarea
          onChange={handlemsg}
          value={msg}
          className="w-full sm:w-[85%] md:w-[75%] h-28 sm:h-32 py-3 px-4 border border-gray-600 rounded-xl outline-none bg-blue-800/60 text-white placeholder-gray-400 focus:placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 transition duration-300 shadow-lg backdrop-blur-lg"
          placeholder="Compose your email message..."
        />
        <div className="mt-6 w-full sm:w-[85%] md:w-[75%]">
          <input
            type="file"
            onChange={handlefile}
            className="w-full border-2 border-dashed border-gray-500 py-8 sm:py-12 px-4 text-center text-gray-400 rounded-lg cursor-pointer bg-blue-800/60 hover:border-gray-300 transition duration-300 shadow-inner"
          />
        </div>
        <p className="mt-4 text-base sm:text-lg font-medium">Total Emails Uploaded: {emailList.length}</p>
        <button
          onClick={() => {
            if (!msg.trim()) {
              alert("Please write a message before sending.");
            } else if (emailList.length === 0) {
              alert("Please choose a file with email addresses.");
            } else {
              send();
            }
          }}
          className="mt-6 sm:mt-8 bg-gradient-to-br from-blue-900 to-blue-600 py-2 sm:py-3 px-6 sm:px-8 text-sm sm:text-base font-semibold rounded-full hover:bg-blue-800 transition duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          {status ? "Sending..." : "Send Emails"}
        </button>
      </div>

      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white text-center py-6 sm:py-8 shadow-2xl fade-in rounded-t-lg mt-6">
        <p className="text-base sm:text-lg">Start your email marketing journey today and make it more efficient than ever!</p>
      </div>

    </div>
  );
}

export default App;