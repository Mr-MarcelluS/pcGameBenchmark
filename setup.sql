DROP DATABASE IF EXISTS pc_benchmark;
CREATE DATABASE pc_benchmark;
USE pc_benchmark;

-- CPU TABLE
CREATE TABLE cpus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(50),
    name VARCHAR(100),
    cpu_mark INT 
);

-- GPU TABLE
CREATE TABLE gpus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(50),
    name VARCHAR(100),
    g3d_mark INT, 
    vram_gb INT   
);

-- GAMES TABLE 
CREATE TABLE games (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    image VARCHAR(255),
    min_cpu_mark INT,
    rec_cpu_mark INT,
    min_g3d_mark INT,
    rec_g3d_mark INT,
    min_ram INT,
    rec_ram INT
);

-- INSERTING CPUs 
INSERT INTO cpus (brand, name, cpu_mark) VALUES
('Intel', 'Core i3-4130', 3280),
('Intel', 'Core i5-4460', 4840),
('Intel', 'Core i7-4790K', 8050),
('Intel', 'Core i3-8100', 6120),
('Intel', 'Core i5-9400F', 9530),
('Intel', 'Core i7-9700K', 14550),
('Intel', 'Core i5-12400F', 19520),
('Intel', 'Core i7-13700K', 46580),
('Intel', 'Core i9-14900K', 60800),
('AMD', 'FX-6300', 4280),
('AMD', 'FX-8350', 5940),
('AMD', 'Ryzen 3 3200G', 7130),
('AMD', 'Ryzen 5 3600', 17820),
('AMD', 'Ryzen 5 5600X', 21940),
('AMD', 'Ryzen 7 5800X3D', 28310),
('AMD', 'Ryzen 7 7800X3D', 34430),
('AMD', 'Ryzen 9 7950X', 63210);

-- INSERTING GPUs
INSERT INTO gpus (brand, name, g3d_mark, vram_gb) VALUES
('Intel', 'UHD Graphics 630 (Integrated)', 1240, 0),
('Nvidia', 'GeForce GTX 750 Ti', 3760, 2),
('Nvidia', 'GeForce GTX 970', 9640, 4),
('Nvidia', 'GeForce GTX 1050 Ti', 5970, 4),
('Nvidia', 'GeForce GTX 1060 (6GB)', 10140, 6),
('Nvidia', 'GeForce GTX 1660 Super', 12780, 6),
('Nvidia', 'GeForce RTX 2060', 14030, 6),
('Nvidia', 'GeForce RTX 3060', 17140, 12),
('Nvidia', 'GeForce RTX 3080', 25010, 10),
('Nvidia', 'GeForce RTX 4070', 26950, 12),
('Nvidia', 'GeForce RTX 4090', 38850, 24),
('AMD', 'Radeon RX 570', 6980, 4),
('AMD', 'Radeon RX 580', 8740, 8),
('AMD', 'Radeon RX 5700 XT', 16750, 8),
('AMD', 'Radeon RX 6700 XT', 19930, 12),
('AMD', 'Radeon RX 7900 XTX', 31550, 24);

-- INSERTING GAMES 
INSERT INTO games (id, title, description, image, min_cpu_mark, rec_cpu_mark, min_g3d_mark, rec_g3d_mark, min_ram, rec_ram) VALUES
('cyberpunk', 'Cyberpunk 2077', 'A graphical masterpiece requiring high specs.', 'images/cyberpunk.jpg', 9500, 19500, 10100, 25000, 8, 16),
('gta-v', 'Grand Theft Auto V', 'Rockstar open-world masterpiece.', 'images/gtav.jpg', 4800, 8000, 3700, 9600, 4, 8),
('minecraft', 'Minecraft', 'Build anything you can imagine.', 'images/minecraft.jpg', 3200, 6100, 1200, 5900, 4, 8),
('valorant', 'Valorant', '5v5 character-based tactical shooter.', 'images/valorant.jpg', 3200, 9500, 1200, 10100, 4, 8),
('alan-wake-2', 'Alan Wake 2', 'Next-gen horror game.', 'images/alan_wake.webp', 17800, 21900, 14000, 26900, 16, 16);