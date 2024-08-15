import { useState, useEffect } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";
import CertificateTemplate from "./assets/template.pdf";

const App = () => {
  const [uri, setUri] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [issueDate, setIssueDate] = useState("");

  useEffect(() => {
    const createPDF = async () => {
      const res = await fetch(CertificateTemplate);
      const exByte = await res.arrayBuffer();

      const pdfDoc = await PDFDocument.load(exByte);

      const result = await pdfDoc.saveAsBase64({ dataUri: true });
      setUri(result);
    };
    createPDF();
  }, []);

  const createPDF = async () => {
    const res = await fetch(CertificateTemplate);
    const exByte = await res.arrayBuffer();

    const pdfDoc = await PDFDocument.load(exByte);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const firstPage = pdfDoc.getPages()[0];
    const { width } = firstPage.getSize();

    // Write Text
    const writeText = (text, font, fontSize, y) => {
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      firstPage.drawText(text, {
        x: (width - textWidth) / 2,
        y,
        size: fontSize,
        font,
      });
    };

    writeText(studentName, fontBold, 60, 590);
    writeText("The UX/UI Blueprint: Crafting User-Focused", fontBold, 54, 440);
    writeText("Design Class", fontBold, 54, 370);
    writeText("Issue Date : " + issueDate, fontRegular, 26, 200);

    // Generate width for instructor
    const generateWidthForInstructor = (text) => {
      const instructorTextWidth = fontRegular.widthOfTextAtSize(text, 28);
      return (300 - instructorTextWidth) / 2 + 160;
    };

    firstPage.drawText(instructorName, {
      x: generateWidthForInstructor(instructorName),
      y: 150,
      size: 28,
      font: fontRegular,
    });

    firstPage.drawText("(Instructor)", {
      x: generateWidthForInstructor("(Instructor)"),
      y: 115,
      size: 28,
      font: fontRegular,
    });

    const result = await pdfDoc.saveAsBase64({ dataUri: true });
    setUri(result);
  };

  return (
    <div className="container mx-auto px-16">
      <h1 className="text-center text-4xl font-bold my-7">
        Certificate Generator
      </h1>
      <div className="flex justify-between items-end">
        <div>
          <label htmlFor="student_name" className="block mr-3">
            Student Name
          </label>
          <input
            type="text"
            id="student_name"
            className="border border-gray-300 rounded py-1 px-3 my-2 w-72 outline-none"
            placeholder="Student Name"
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="course_name" className="block mr-3">
            Course Name
          </label>
          <input
            type="text"
            id="course_name"
            className="border border-gray-300 rounded py-1 px-3 my-2 w-72 outline-none"
            placeholder="Course Name"
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="instructor_name" className="block mr-3">
            Instructor Name
          </label>
          <input
            type="text"
            id="instructor_name"
            className="border border-gray-300 rounded py-1 px-3 my-2 w-72 outline-none"
            placeholder="Instructor Name"
            onChange={(e) => setInstructorName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="issue_date" className="block mr-3">
            Issue Date
          </label>
          <input
            type="text"
            id="issue_date"
            className="border border-gray-300 rounded py-1 px-3 my-2 w-72 outline-none"
            placeholder="Issue Date"
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>
        <div>
          <button
            className="px-7 py-1 my-2 border border-blue-600 rounded-md"
            onClick={createPDF}
          >
            Generate
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-16">
        <iframe src={uri} id="mypdf" width="900px" height="700px"></iframe>
      </div>
    </div>
  );
};

export default App;
