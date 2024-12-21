import React, { useState } from 'react';
import './Program.css';

const programs = [
  {
    id: 'santa-kids',
    title: 'SANTA KIDS',
    shortDescription: 'Teach a kid the “joy of sharing” and he/she shall spread the same to a 100 more...',
    fullDescription: 'Teach a kid the “joy of sharing” and he/she shall spread the same to a 100 more. Maatram foundation through the SANTA KIDS projects aims to spread the joy of giving amongst children early on. Through this initiative, we partner with two schools – collect the wish of a kid from one school which he/she cannot afford and pass it on to children from another school who can become their Santas and bring their dreams to life. Over 900 kids have participated in this project so far.'
  },
  {
    id: 'karpom-karpipom',
    title: 'Karpom Karpippom',
    shortDescription: 'This project aims to identify aspiring students from economically deprived backgrounds and tutor them to excel in their Board exams...',
    fullDescription: 'For the current year (2020-2021), we have around 74 students benefiting from over 19 Government Schools and 23 Private Schools in Tamil Nadu. Tutors have taught 12 subjects including Tamil, English, Physics, Chemistry, Maths, Botany, Zoology, and more. This initiative is program managed by the Maatram Alumni Association.'
  },
  {
    id: 'career-counselling',
    title: 'Career Counselling for School Students',
    shortDescription: 'This project aims to create awareness on fields of education and career opportunities for school-level students...',
    fullDescription: 'We strive to raise awareness on fields of education and career opportunities for school-level students by visiting government and aided schools each year before admissions begin. In the current year, we have reached out to 17,000+ students from 85 schools across 12 districts.'
  },
  {
    id: 'build-library',
    title: 'BUILD A LIBRARY',
    shortDescription: 'A library is pivotal to learning and plays a key role as a space for kids to generate fresh ideas...',
    fullDescription: 'A library is pivotal to learning and plays a key role as a space for kids to generate fresh ideas, encourage innovation, help them improve their problem-solving skills, and inculcate the habit of continuous learning. Our goal is to provide resources and space for learning.'
  },
  {
    id: 'differently-abled',
    title: 'Opportunities for the Differently-Abled',
    shortDescription: 'Every project we embarked on was inspired by someone who truly demonstrated a compelling need to help...',
    fullDescription: 'We partner with organizations who work closely with the differently-abled to provide opportunities that would be vital for them to build their career. For instance, Suguna, a visually impaired woman, was able to live her dream as a teacher in Mahindra World School, thanks to our support.'
  },
  {
    id: 'student-development',
    title: 'Student Development Programs',
    shortDescription: 'Our work doesn’t stop merely with providing students a chance at higher education...',
    fullDescription: 'Through programs like the Maatram Centre of Excellence, we help students upskill and reskill during their college years, focusing on fundamental concepts and emerging technologies such as Data Science, Modelling, AI, and much more.'
  },
  {
    id: 'emergency-relief',
    title: 'Emergency Relief',
    shortDescription: 'We believe in doing our bit every time we encounter a humanitarian crisis...',
    fullDescription: 'Through Chennai Floods in 2015, Cyclone Vardah in 2016, Cyclone Gaja 2018, and COVID-19, we mobilized resources and worked on disaster relief and rehabilitation. We supported over 100 families monthly during COVID, distributed essentials to 2000+ people, and more.'
  },
  {
    id: 'environmental-initiatives',
    title: 'Environmental Initiatives',
    shortDescription: 'Our environmental initiatives focus on protecting and improving the natural environment...',
    fullDescription: 'We engage in various environmental projects such as tree planting, waste management, and awareness campaigns on climate change. Through these initiatives, we aim to reduce carbon footprints and contribute to a greener future.'
  }
];

const ProgramCard = ({ program, onViewMore }) => {
  return (
    <div className="program-card">
      <h3>{program.title}</h3>
      <p>{program.shortDescription}</p>
      <button onClick={() => onViewMore(program)} className="view-more-btn">
        View More
      </button>
    </div>
  );
};

const Program = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleViewMore = (program) => {
    setSelectedProgram(program);
  };

  const handleCloseModal = () => {
    setSelectedProgram(null);
  };

  return (
    <div className="program-container">
      <header className="header">
        <img src="https://tse3.mm.bing.net/th?id=OIP.yp98A8KaJnzV1Ha8xYnduAAAAA&pid=Api&P=0&h=180" alt="Logo" className="logo" />
      </header>

      <h1 className="program-heading">Our Programs</h1>

      <div className="program-cards">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} onViewMore={handleViewMore} />
        ))}
      </div>

      {/* Modal */}
      {selectedProgram && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selectedProgram.title}</h2>
            <p>{selectedProgram.fullDescription}</p>
            <button onClick={handleCloseModal} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Program;