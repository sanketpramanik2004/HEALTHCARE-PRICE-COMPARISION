USE hospital_db;

-- Optional cleanup before reseeding
-- DELETE FROM doctor WHERE hospital_id IN (5, 6, 7);

INSERT INTO doctor (name, specialization, experience, consultation_fee, availability, hospital_id) VALUES

-- Apollo Gleneagles Hospitals (5)
('Ananya Sen', 'Cardiologist', 11, 1200, '09:00,10:00,11:00,16:00', 5),
('Rohit Mehra', 'Neurologist', 14, 1500, '10:00,12:00,14:00,17:00', 5),
('Priya Mukherjee', 'Dermatologist', 8, 900, '09:30,11:30,13:30,16:30', 5),
('Sagnik Dutta', 'Orthopedic', 12, 1100, '09:00,10:30,12:30,15:00', 5),
('Ishita Ghosh', 'Pulmonologist', 10, 1150, '08:30,10:00,12:00,17:30', 5),
('Arindam Roy', 'Gastroenterologist', 13, 1400, '09:30,11:00,13:00,18:00', 5),
('Neha Kapoor', 'General Physician', 9, 800, '08:00,09:00,10:00,11:00,17:00', 5),

-- Medica Superspeciality Hospital (6)
('Debasmita Paul', 'Cardiologist', 9, 1100, '09:15,10:15,11:15,16:15', 6),
('Vikram Sharma', 'Neurologist', 15, 1450, '10:15,12:15,14:15,17:15', 6),
('Riya Agarwal', 'Dermatologist', 7, 850, '09:45,11:45,13:45,16:45', 6),
('Subhajit Bose', 'Orthopedic', 10, 1000, '09:15,10:45,12:45,15:15', 6),
('Farhan Ali', 'Pulmonologist', 11, 1050, '08:45,10:15,12:15,17:45', 6),
('Madhumita Das', 'Gastroenterologist', 12, 1350, '09:45,11:15,13:15,18:15', 6),
('Sohini Chatterjee', 'General Physician', 8, 750, '08:15,09:15,10:15,11:15,17:15', 6),

-- Fortis Hospital Anandapur (7)
('Abhishek Banerjee', 'Cardiologist', 13, 1300, '09:30,10:30,11:30,16:30', 7),
('Tanaya Mitra', 'Neurologist', 12, 1550, '10:30,12:30,14:30,17:30', 7),
('Kunal Jain', 'Dermatologist', 8, 950, '09:10,11:10,13:10,16:10', 7),
('Poulomi Sen', 'Orthopedic', 11, 1150, '09:30,11:00,13:00,15:30', 7),
('Harsh Vardhan', 'Pulmonologist', 10, 1200, '08:30,10:30,12:30,17:00', 7),
('Nandita Saha', 'Gastroenterologist', 14, 1450, '09:20,11:20,13:20,18:20', 7),
('Aman Verma', 'General Physician', 9, 850, '08:00,09:30,10:30,11:30,17:30', 7);

SELECT hospital_id, name, specialization, consultation_fee, availability
FROM doctor
ORDER BY hospital_id, specialization, name;
