let lastUserInput = '';
let typingTimeout; // Variable to store the typing timeout reference
let stopTyping = false; // Variable to control if typing should stop
let lastBotResponse = ''; // Variable to store the last bot response





function speakText(text) {
    const speechSynthesis = window.speechSynthesis; // Access the speech synthesis API
    const utterance = new SpeechSynthesisUtterance(text); // Create an utterance with the given text
    utterance.lang = 'en-US'; // Set language to English
    speechSynthesis.speak(utterance); // Speak the utterance
}

document.getElementById('send-button').addEventListener('click', function() {
    handleUserInput();
});

document.getElementById('user-input').addEventListener('input', function() {
    const sendButton = document.getElementById('send-button');
    if (this.value.trim()) {
        sendButton.classList.remove('disabled');
        sendButton.disabled = false;
    } else {
        sendButton.classList.add('disabled');
        sendButton.disabled = true;
    }
});

document.getElementById('stop-typing-button').addEventListener('click', function() {
    stopTyping = true; // Set flag to stop typing
    clearTimeout(typingTimeout); // Clear any ongoing typing timeout
    removeTypingIndicator(); // Remove the typing indicator immediately
});

document.getElementById('drag-down-btn').addEventListener('click', toggleDragDownContent);
document.getElementById('copy-text-btn').addEventListener('click', copyText);

document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});



document.getElementById('talk-button').addEventListener('click', function() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-NG'; // Set language for speech recognition to Nigerian English
        recognition.interimResults = false; // Only final results

        recognition.start();

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            document.getElementById('user-input').value = transcript;
            handleUserInput(); // Call the function to handle user input
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error detected:', event.error);
        };

        recognition.onend = function() {
            console.log('Speech recognition service disconnected');
        };
    } else {
        alert('Sorry, your browser does not support the Web Speech API.');
    }
});


function handleUserInput(isRegenerate = false) {
    const userInput = document.getElementById("user-input").value.trim().toLowerCase();
    if (userInput || isRegenerate) {
        if (isRegenerate) {
            addMessageToChat('user', lastUserInput);
        } else {
            addMessageToChat('user', userInput);
            lastUserInput = userInput;
            document.getElementById("user-input").value = '';
        }
        addTypingIndicator();
        setTimeout(() => getBotResponse(userInput || lastUserInput), 1000); // Delay for typing indicator
    }
}

function toggleDragDownContent() {
    const content = document.getElementById('drag-down-content');
    const button = document.getElementById('drag-down-btn');
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        button.textContent = 'Close Information';
    } else {
        content.style.display = 'none';
        button.textContent = 'Show More Information About David AI Chat Bot';
    }
}

function copyText() {
    const chatBox = document.getElementById('chat-box');
    const range = document.createRange();
    range.selectNode(chatBox);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges(); // Clear selection
    alert('Chat content copied to clipboard!');
}

function addTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox.querySelector('.typing-indicator')) {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.textContent = '';
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
}

function removeTypingIndicator() {
    const chatBox = document.getElementById('chat-box');
    const typingIndicator = chatBox.querySelector('.typing-indicator');
    if (typingIndicator) {
        chatBox.removeChild(typingIndicator);
    }
}

function switchToStopTypingButton() {
    document.getElementById('send-button').classList.remove('show');
    document.getElementById('stop-typing-btn').classList.add('show');
}

function switchToSendButton() {
    document.getElementById('stop-typing-btn').classList.remove('show');
    document.getElementById('send-button').classList.add('show');
}

function toggleSendButton() {
    const userInput = document.getElementById("user-input").value.trim();
    const sendButton = document.getElementById('send-button');
    if (userInput.length > 0) {
        sendButton.style.opacity = 1;
        sendButton.style.cursor = 'pointer';
        sendButton.classList.add('show');
    } else {
        sendButton.style.opacity = 0.5;
        sendButton.style.cursor = 'not-allowed';
        sendButton.classList.remove('show');
    }
}

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    chatBox.appendChild(messageElement);

    addTypingIndicator();
    stopTyping = false;

    const formattedMessage = message.replace(/\n/g, `
        `);

    let index = 0;

    function typeLetter() {
        if (index < formattedMessage.length) {
            if (stopTyping) {
                messageElement.innerHTML = formattedMessage;
                chatBox.scrollTop = chatBox.scrollHeight;
                removeTypingIndicator();
                return;
            }
            messageElement.innerHTML += formattedMessage[index];
            index++;
            typingTimeout = setTimeout(typeLetter, -1000);
        } else {
            chatBox.scrollTop = chatBox.scrollHeight;
            removeTypingIndicator();
            switchToSendButton(); // Switch back to send button after typing
        }
    }

    typeLetter();
}



function addImage(url, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}`;
    const imageElement = document.createElement("img");
    imageElement.src = url;
    imageElement.src = url;
    imageElement.style.maxWidth = "100%";
    messageElement.appendChild(imageElement);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addTable(data, sender) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}`;
    const tableElement = document.createElement("table");
    tableElement.style.width = "100%";
    tableElement.style.borderCollapse = "collapse";
   
    data.forEach(row => {
        const rowElement = document.createElement("tr");
        row.forEach(cell => {
            const cellElement = document.createElement("td");
            cellElement.style.border = "1px solid #ddd";
            cellElement.style.padding = "8px";
            cellElement.innerText = cell;
            rowElement.appendChild(cellElement);
        });
        tableElement.appendChild(rowElement);
    });
   
    messageElement.appendChild(tableElement);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}



function getBotResponse(userInput) {
    removeTypingIndicator(); // Remove typing indicator before displaying response
    let response;

    // Fundamental Quantities
    if (userInput.includes('what is length')) {
        response = "Length is a measure of distance. Its SI unit is meter (m).";
    } else if (userInput.includes('what is pythagorean theorem')||(userInput.includes('what is pythagorean theory'))) {
        response = 'The Pythagorean theorem states that in a right triangle, a² + b² = c².';
         } else if (userInput.includes('how do you calculate the area of a circle')||(userInput.includes('how do we calculate the area of a circle'))||(userInput.includes('how do we calculate the area of a circle'))) {
        response = 'The area of a circle is calculated using the formula A = πr², where r is the radius.';
         }else if (userInput.includes('what is a prime number')) {
            response = 'A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.';
         } else if (userInput.includes('what is the quadratic formula')) {
            response = 'The quadratic formula is used to find the solutions of a quadratic equation: x = (-b ± √(b² - 4ac)) / 2a.';


        } else if (userInput.includes('what is technology')|| (userInput.includes('define technology'))) {
            response = `Technology refers to the application of scientific knowledge, tools, techniques, and methods to solve problems, improve processes, and achieve specific goals. It encompasses a wide range of fields, from electronics, computing, and communication systems to more traditional domains like agriculture, medicine, and transportation.
At its core, technology aims to make tasks easier, more efficient, or more effective by creating new tools, machines, software, or systems that enhance human abilities, automate repetitive tasks, and connect people across the globe. It continually evolves as new discoveries and innovations are made, influencing every aspect of modern life.`;
        } else if (userInput.includes('ages of technology development')|| (userInput.includes('state the ages of development of technology'))) {
            response = `The development of technology has occurred over several distinct ages, each marked by significant advancements and innovations that shaped human civilization. Here is a summary of the major ages of technology development:

 1. Stone Age (2.5 million years ago – 3000 BCE)
- The earliest period of human technological development.
- Humans used simple stone tools for hunting, gathering, and building shelters.
- Fire was discovered and controlled, and basic tools like knives, spears, and axes were developed.

 2. Bronze Age (3000 BCE – 1200 BCE)
- Marked by the discovery of metalworking, particularly the creation of bronze (an alloy of copper and tin).
- Tools and weapons made from bronze were stronger and more durable than stone.
- The age saw the development of early urban civilizations, writing systems, and advancements in agriculture and trade.

 3. Iron Age (1200 BCE – 500 CE)
- Characterized by the widespread use of iron and steel for tools, weapons, and construction.
- Iron was more abundant and easier to produce than bronze, leading to improvements in farming, warfare, and transportation.
- Development of early infrastructure like roads, aqueducts, and fortified cities.

 4. Middle Ages (500 CE – 1500 CE)
- Marked by technological stagnation in some regions but also innovation in others (e.g., the Islamic Golden Age).
- Significant advancements in agriculture (e.g., the plow, watermills), architecture (e.g., Gothic cathedrals), and navigation (e.g., the compass).
- Printing technology began with the invention of the movable type printing press by Johannes Gutenberg in the 15th century.

 5. Renaissance and Early Modern Age (1500 – 1750)
- A period of renewed interest in science, art, and exploration.
- Significant technological advancements included the telescope, microscope, mechanical clocks, and early steam engines.
- Innovations in navigation led to the Age of Exploration, with major sea voyages and the discovery of new lands.

 6. Industrial Age (1750 – 1900)
- Marked by the Industrial Revolution, a period of rapid industrialization and technological growth.
- Development of machines, steam engines, railways, factories, and mass production techniques.
- Major innovations in communication (telegraph, telephone), transportation (trains, steamships), and energy (coal, steam power).

 7. Electric Age (Late 19th century – Early 20th century)
- Characterized by the widespread adoption of electricity.
- Inventions like the electric light bulb, electric motors, and electrical communication systems (radio, telegraph) revolutionized daily life and industries.
- The rise of automobiles, airplanes, and other technologies transformed transportation and communication.

 8. Atomic Age (Mid-20th century)
- Began with the development of nuclear technology, marked by the creation of nuclear weapons and power plants.
- Space exploration started, leading to the launch of satellites and human missions to space (e.g., the moon landing in 1969).
- Development of transistors and semiconductors paved the way for modern electronics.

 9. Information Age (1970s – Present)
- Defined by the rapid advancement of digital technology, computing, and the internet.
- Development of personal computers, mobile phones, and the World Wide Web revolutionized communication, information sharing, and business.
- Ongoing innovation in artificial intelligence, biotechnology, nanotechnology, and quantum computing.

 10. Post-Information Age (Emerging)
- A period of rapid technological convergence, integrating AI, big data, quantum computing, and advanced robotics.
- Focus on sustainable and green technologies, renewable energy, and advanced medical technologies.
- Advancements in virtual reality, augmented reality, and the Internet of Things (IoT) are transforming how humans interact with technology and each other.

These ages highlight the continuous evolution of technology, reflecting humanity's drive to innovate, explore, and solve complex problems.`;
        } else if (userInput.includes('the period when stones and rocks are used in making tools and weapons is called')|| (userInput.includes('the period when stones and rocks were used to make tools and weapons is called'))) {
            response = `The period when stones and rocks were primarily used to make tools and weapons is called the Stone Age. 

The Stone Age is divided into three main periods:
1. Paleolithic (Old Stone Age) - The earliest and longest phase, characterized by the use of simple stone tools for hunting, gathering, and daily survival.
2. Mesolithic (Middle Stone Age) - A transitional period with the development of more refined stone tools, as well as the beginnings of agriculture and settled communities.
3. Neolithic (New Stone Age) - Marked by the advent of agriculture, domestication of animals, and the creation of more advanced stone tools, pottery, and permanent settlements. 

The Stone Age spanned from approximately 2.5 million years ago to around 3000 BCE, ending with the discovery and use of metals like copper and bronze.`;
        } else if (userInput.includes('state the features of industrial age')|| (userInput.includes(`what are the features of industrial age`))) {
            response = `The industrial Industrial Ageindustrial , which began in the late 18th century and continued into the early 20th century, was characterized by significant transformations in society, technology, and the economy. Here are the key features of the Industrial Age:

industrial Key Features of the Industrial Age

1. industrial Mechanization and Mass Productionindustrial 
   - Introduction of machinery to replace manual labor, particularly in industries like textiles, mining, and manufacturing.
   - Development of the factory system, enabling mass production of goods with greater efficiency and at lower costs.
   - Use of assembly lines and standardized parts, which revolutionized the production process.

2. industrial Steam Power and Energy Innovationindustrial 
   - Invention and widespread use of steam engines, primarily powered by coal, to drive machinery in factories, locomotives, and ships.
   - Shift from human and animal power to mechanical power, which increased production capacity and reduced reliance on manual labor.

3. industrial Urbanization and Industrial Citiesindustrial 
   - Rapid growth of cities as people moved from rural areas to urban centers in search of work in factories and industries.
   - Development of new industrial cities with infrastructure such as roads, railways, ports, and housing for factory workers.
   - Emergence of distinct social classes, including the industrial working class and the capitalist class (factory owners, entrepreneurs).

4. industrial Transportation and Communication Advancesindustrial 
   - Significant improvements in transportation, including the expansion of railroads, canals, and steamships, which facilitated the movement of goods and people over long distances.
   - Development of the telegraph and later the telephone, which revolutionized communication by allowing rapid information exchange across vast distances.

5. industrial Capitalism and Economic Growthindustrial 
   - Rise of capitalism as the dominant economic system, characterized by private ownership of production means, competitive markets, and profit-driven enterprises.
   - Growth of global trade and markets, with increased demand for raw materials and the export of manufactured goods.

6. industrial Technological Innovationindustrial 
   - Continuous development of new technologies, including mechanical looms, power looms, and the cotton gin, which enhanced productivity in textile manufacturing.
   - Inventions like the steam engine, spinning jenny, and mechanical reaper dramatically changed production in various industries.

7. industrial Labor Changes and Factory Systemindustrial 
   - Shift from agricultural work to factory-based work, where workers performed repetitive tasks under strict supervision.
   - Introduction of wage labor, where people were paid for their time and work rather than owning the means of production.
   - Emergence of labor unions and movements advocating for better working conditions, fair wages, and reasonable working hours.

8. industrial Social and Cultural Impactindustrial 
   - Changes in social structures and lifestyles, with increased emphasis on industrial and urban living.
   - Challenges such as poor working conditions, child labor, and crowded, unsanitary living conditions in rapidly growing cities.
   - Rise of new social ideologies, including socialism, which critiqued the inequalities and social impacts of industrial capitalism.

9. industrial Environmental Changesindustrial 
   - Increased exploitation of natural resources, including coal, iron, and timber, to fuel industrial growth.
   - Environmental degradation due to deforestation, air and water pollution, and waste from factories and industrial processes.

10. industrial Education and Workforce Developmentindustrial 
    - Expansion of education systems to provide workers with the necessary skills for industrial jobs, such as reading, writing, and basic arithmetic.
    - Creation of technical schools and institutions to train engineers, mechanics, and other professionals to support industrial growth.

These features highlight the profound transformations brought about by the Industrial Age, laying the groundwork for modern economic, social, and technological advancements.`;
        } else if (userInput.includes('state the features of electronic age')|| (userInput.includes('state the features of electronic age'))) {
            response = `The Electronic Age, which began in the late 19th and early 20th centuries, is marked by the widespread use of electricity and electronic devices to transform communication, information processing, and daily life. This era laid the foundation for the modern digital age. Here are the key features of the Electronic Age:

Key Features of the Electronic Age

1. Widespread Use of Electricity
   - Development and distribution of electrical power for homes, industries, and cities, transforming daily life and work.
   - Introduction of electric lighting, which extended productive hours and improved safety in homes, factories, and streets.
   - Invention and proliferation of electrical appliances (like refrigerators, washing machines, and radios) that improved convenience and quality of life.

2. Invention of Key Electronic Devices
   - Vacuum Tubes: Enabled the creation of early electronic devices like radios, televisions, and the first computers.
   - Transistors: Replaced vacuum tubes in the mid-20th century, allowing for smaller, more reliable, and energy-efficient electronic devices.
   - Semiconductors and Integrated Circuits: Led to the development of microchips and the miniaturization of electronic components, paving the way for modern computing.

3. Advances in Communication Technology
   - Invention of the telegraph and later the telephone revolutionized long-distance communication, making it faster and more reliable.
   - Development of radio and television broadcast technology enabled the mass dissemination of news, entertainment, and information to large audiences.
   - Introduction of satellite communication expanded global connectivity, making instant communication across the world possible.

4. Rise of the Computing Industry
   - Development of the first electronic computers (e.g., ENIAC) in the mid-20th century, initially used for military and scientific purposes.
   - Evolution of computers from large, room-sized machines to smaller, more powerful devices (like personal computers) due to advancements in microprocessors.
   - Creation of software and programming languages that allowed computers to perform a wide range of tasks, from business applications to scientific research.

5. Miniaturization of Technology
   - Progress in electronics led to the miniaturization of devices, making them portable and accessible to the general public.
   - Development of smaller and more powerful transistors, microchips, and integrated circuits enabled the creation of compact consumer electronics, like pocket radios, calculators, and later, personal computers.

6. Information Storage and Retrieval
   - Introduction of magnetic tape, hard drives, and other data storage technologies revolutionized how information was stored, processed, and accessed.
   - Development of digital databases and information management systems improved the efficiency of data retrieval and analysis in various fields, including business, science, and government.

7. Automation and Control Systems
   - Application of electronics in automation, including the development of control systems for manufacturing, transportation, and utilities.
   - Creation of robots and automated machines that could perform tasks previously done by humans, leading to increased efficiency and productivity in industries.

8. Emergence of the Digital Economy
   - Growth of industries focused on electronics, telecommunications, computing, and software development.
   - Rise of new business models and services, including electronic trading, e-commerce, and digital media, driven by advancements in electronic communication and data processing.

9. Improved Entertainment and Media
   - Development of new forms of entertainment, such as radio programs, television shows, and later, digital content like CDs, DVDs, and streaming media.
   - Expansion of the global media industry and the creation of a new era of information sharing and cultural exchange.

10. Innovation in Healthcare and Medicine
    - Use of electronic devices and machines, like X-ray machines, ECGs, and later MRI and CT scanners, transformed medical diagnostics and treatment.
    - Development of electronic health records, telemedicine, and remote monitoring technologies improved healthcare delivery and patient management.

11. Foundation for the Digital Age
    - The Electronic Age set the stage for the subsequent Information Age by enabling the development of computers, the internet, and digital communication.
    - Ongoing innovation in electronics continues to drive advancements in AI, biotechnology, IoT (Internet of Things), and quantum computing.

Impact of the Electronic Age

The Electronic Age brought about a massive transformation in nearly every aspect of society, from communication and commerce to entertainment and healthcare. It created the infrastructure and technologies that continue to shape our digital world today.`;
        } else if (userInput.includes('the computer age can also be called what')|| (userInput.includes('the computer age can also be called'))) {
            response = `The Computer Age can also be called the Information Age or the Digital Age.

These terms are often used interchangeably to describe the period beginning in the latter half of the 20th century, characterized by the rapid development and widespread adoption of computers, digital technologies, and the internet. This era emphasizes the shift from traditional industrial processes to an economy based on information technology, digital communication, and data processing.`;
        } else if (userInput.includes('the middle age what between what and what centurries')|| (userInput.includes('the middle age what between which centurries'))) {
            response = `The Middle Ages spanned from the 5th century to the late 15th century, specifically from around 500 CE to 1500 CE. This period began with the fall of the Western Roman Empire in the 5th century (around 476 CE) and ended with the beginning of the Renaissance and the Age of Discovery in the late 15th century (around 1450–1500 CE).

The Middle Ages is typically divided into three sub-periods:
1. Early Middle Ages (500–1000 CE): Also known as the Dark Ages, marked by the decline of Roman influence, the spread of Christianity, and the formation of early medieval kingdoms.
2. High Middle Ages (1000–1300 CE): Characterized by the growth of cities and trade, the rise of powerful monarchies, the Crusades, and significant cultural and intellectual advancements.
3. Late Middle Ages (1300–1500 CE): Marked by challenges such as the Black Death, the Hundred Years' War, and the decline of feudalism, leading to the dawn of the Renaissance.`;
        } else if (userInput.includes('what is information technology')|| (userInput.includes('define information technology'))) {
            response = `
Information Technology (IT) refers to the use of computers, networks, storage, software, and other digital devices to manage, process, store, transmit, and retrieve data and information. It involves the application of technology to solve business problems, enhance communication, automate processes, and support decision-making across various sectors.`;
        } else if (userInput.includes('key components of information technology')|| (userInput.includes('what are the key components of information technology'))) {
            response = `Hardware

Physical devices such as computers, servers, networking equipment, storage devices, and peripherals (like printers and scanners).
Software

Programs and applications that run on hardware, including operating systems (like Windows or Linux), productivity software (like Microsoft Office), databases, and specialized software for different tasks (like CRM or ERP systems).
Networking

Systems and technologies that enable data communication and connectivity between devices, such as local area networks (LANs), wide area networks (WANs), and the internet.
Includes networking hardware (like routers, switches, and modems) and protocols (like TCP/IP).
Data Management

Tools and techniques for storing, organizing, managing, and securing data, including databases, data warehouses, and cloud storage solutions.
Includes practices for data analysis, mining, and reporting to support business intelligence and decision-making.
Cybersecurity

Technologies, processes, and practices designed to protect networks, devices, programs, and data from attack, damage, or unauthorized access.
Involves encryption, firewalls, anti-virus software, intrusion detection systems, and other measures to ensure data integrity and privacy.
Cloud Computing

Delivery of computing services (such as servers, storage, databases, networking, software, and analytics) over the internet (“the cloud”) to offer faster innovation, flexible resources, and economies of scale.
Includes infrastructure as a service (IaaS), platform as a service (PaaS), and software as a service (SaaS).
IT Services and Support

Activities that ensure the effective operation and maintenance of IT systems, including technical support, network administration, software updates, and help desk services.
Involves planning, deployment, integration, and management of IT resources to meet organizational needs.`;
        } else if (userInput.includes('key functions of information technology')|| (userInput.includes('what are the key functions of information technology'))) {
            response = `Data Processing: Converting raw data into meaningful information for analysis, decision-making, and reporting.
Communication: Enabling seamless communication through email, instant messaging, video conferencing, and other collaboration tools.
Automation: Streamlining repetitive tasks, processes, and workflows to increase efficiency and reduce human error.
Storage and Retrieval: Providing secure storage and fast retrieval of large amounts of data and information.
Security: Protecting information assets from cyber threats, unauthorized access, and data breaches.`;
        } else if (userInput.includes('what is information and communication technology')|| (userInput.includes('define information and communication technology'))|| (userInput.includes('what is ict'))) {
            response = `Information and Communication Technology (ICT) refers to the integration and use of various technologies to manage, process, and communicate information. It encompasses all technologies and tools used for handling digital and telecommunications data, including both hardware (like computers and mobile devices) and software (like applications and platforms), as well as the networks and systems that connect them.

 Key Components of ICT

1. Information Technology (IT):
   - Involves the use of computers, software, databases, and storage devices to store, process, and manage information.
   - Examples include desktop computers, servers, operating systems, databases, and data management tools.

2. Communication Technology:
   - Refers to technologies that enable the transmission of information and data between people or devices.
   - Includes telecommunications tools like telephones, mobile networks, satellite communications, the internet, email, and social media platforms.

3. Networks:
   - Systems that link various devices and enable communication, such as Local Area Networks (LANs), Wide Area Networks (WANs), wireless networks, and the internet.

4. Software and Applications:
   - Programs and tools that facilitate information management and communication, such as web browsers, email clients, video conferencing software, and social media apps.

5. Telecommunication Infrastructure:
   - The physical and organizational structures needed for the operation of communication services, including cables, satellites, routers, modems, and mobile towers.

 Functions of ICT

- Data Processing and Management: Collecting, storing, and managing data to provide meaningful information.
- Communication: Facilitating instant communication through various channels, such as voice calls, emails, instant messaging, and video conferencing.
- Connectivity: Providing platforms and networks for global connectivity, allowing people and organizations to connect and collaborate regardless of their location.
- Automation and Efficiency: Automating routine tasks and processes, improving operational efficiency in various fields such as business, healthcare, education, and government.
- Content Creation and Sharing: Enabling the creation, sharing, and distribution of digital content (e.g., text, images, video) across multiple platforms and formats.

 Importance of ICT

- Enhances Communication: Improves the speed, reliability, and accessibility of communication worldwide, making it easier for people to connect and share information.
- Supports Education and Learning: Provides access to a vast array of educational resources, online courses, and e-learning platforms, enabling distance learning and lifelong education.
- Drives Economic Growth: ICT is a critical driver of innovation, economic development, and globalization, creating new business opportunities and markets.
- Improves Service Delivery: Enhances the efficiency and effectiveness of services across various sectors, such as healthcare (e.g., telemedicine), government (e.g., e-governance), and retail (e.g., e-commerce).
- Enables Digital Inclusion: Provides access to information and services to people in remote and underserved areas, reducing digital divides and fostering social inclusion.

 Impact of ICT

ICT has transformed nearly every aspect of modern life, enabling more efficient communication, data management, and service delivery across multiple domains. It continues to play a key role in fostering innovation, economic growth, and social development globally.`;
        } else if (userInput.includes('importance of information technology')|| (userInput.includes('what are importance of information technology'))) {
            response = `Improves Efficiency and Productivity: Automates tasks, optimizes workflows, and enhances communication, which increases productivity across industries.
Facilitates Communication: Enables instant communication and collaboration across geographical boundaries, enhancing global connectivity.
Supports Innovation: Drives innovation in various fields, such as healthcare, finance, education, and entertainment, by providing tools and platforms for new applications and services.
Data Management and Analysis: Helps organizations collect, store, and analyze large amounts of data to gain insights, identify trends, and support strategic planning.
Enhances Customer Experience: Improves service delivery and customer satisfaction through technologies like e-commerce, customer relationship management (CRM) systems, and online support.`;
        } else if (userInput.includes('what is the full meaning of ict')|| (userInput.includes('what is the acronym of ict'))) {
            response = `The full meaning of 'ICT' is Information and Communication Technology.`;
        } else if (userInput.includes('when was computer invented')|| (userInput.includes('explain when computer was invented'))) {
            response = `The history of computers is complex and involves the development of several key technologies over time. Here’s an overview of the significant milestones leading to the invention and evolution of computers:

Early Concepts and Mechanical Calculators

1. Early Mechanical Calculators (17th-19th centuries):
   - 1642: Blaise Pascal invented the Pascaline, an early mechanical calculator used for addition and subtraction.
   - 1673: Gottfried Wilhelm Leibniz developed the Stepped Reckoner, which could perform multiplication and division.

2. Charles Babbage’s Designs (19th century):
   - 1830s: Charles Babbage conceptualized the Analytical Engine, an early mechanical general-purpose computer. It was designed to perform any calculation or process data, but it was never fully built in his lifetime.
   - Difference Engine: Another of Babbage's inventions, designed for calculating and printing mathematical tables.

Early Electronic Computers

1. 1930s - 1940s:
   - 1936: Alan Turing proposed the concept of a universal machine (now known as the Turing Machine), laying the theoretical foundation for modern computers.
   - 1937-1942: John Atanasoff and Clifford Berry developed the Atanasoff-Berry Computer (ABC), one of the first electronic computers to use binary digits and electronic switches.
   - 1941: Konrad Zuse built the Z3, an early programmable computer using electromechanical relays.

2. First Generation Computers (1940s-1950s):
   - 1943-1944: The Colossus was developed in the UK for codebreaking during World War II. It was one of the first electronic digital computers.
   - 1945: The ENIAC (Electronic Numerical Integrator and Computer) was completed at the University of Pennsylvania. It is often regarded as the first general-purpose electronic digital computer, designed for computing artillery trajectories.
   - 1946: The EDSAC (Electronic Delay Storage Automatic Calculator), built at the University of Cambridge, was one of the first computers to use stored programs.

Subsequent Developments

1. Second Generation Computers (1950s-1960s):
   - Transistors replaced vacuum tubes, leading to smaller, more reliable, and more efficient computers.

2. Third Generation Computers (1960s-1970s):
   - Integrated Circuits further reduced the size of computers and increased their performance. This generation saw the advent of more powerful and affordable computers.

3. Fourth Generation Computers (1970s-present):
   - Microprocessors were introduced, integrating thousands of transistors into a single chip, leading to the development of personal computers and modern computing.

4. Fifth Generation Computers (Present and Beyond):
   - Focus on artificial intelligence (AI) and advanced computing technologies, including quantum computing, machine learning, and nanotechnology.

Summary

The concept of a computer has evolved significantly from early mechanical calculators and theoretical models to modern electronic and digital systems. Key milestones include Charles Babbage's analytical engine, early electronic computers like ENIAC, and the development of transistors and microprocessors. These innovations collectively laid the foundation for the powerful and versatile computers we use today.`;
        } else if (userInput.includes('features of computer invention')|| (userInput.includes('state the features of invention of computer'))) {
            response = `The invention and development of computers have introduced numerous features that have significantly transformed various aspects of society, industry, and daily life. Here are some key features and characteristics associated with the invention of computers:

1. Automated Calculation
   - Feature: Computers automate the process of performing calculations and processing data.
   - Impact: This capability significantly speeds up mathematical computations and data analysis compared to manual methods.

2. Programmability
   - Feature: Computers can be programmed to perform a wide range of tasks based on instructions provided by users.
   - Impact: This flexibility allows computers to execute various applications, from simple calculations to complex simulations and data processing.

3. Storage Capacity
   - Feature: Computers can store large amounts of data and information in various forms, including files, databases, and cloud storage.
   - Impact: This feature enables users to manage, retrieve, and organize vast amounts of data efficiently.

4. Speed and Efficiency
   - Feature: Computers process data and perform operations at incredibly high speeds, far exceeding human capabilities.
   - Impact: Increased speed and efficiency lead to faster decision-making, problem-solving, and productivity in various fields.

5. Data Processing and Analysis
   - Feature: Computers can process and analyze data, performing tasks such as sorting, filtering, and statistical analysis.
   - Impact: This ability is crucial for tasks in scientific research, business analytics, finance, and more.

6. Connectivity and Networking
   - Feature: Computers can connect to other computers and networks, enabling communication and data exchange over local and global networks (e.g., the internet).
   - Impact: This connectivity facilitates collaboration, access to information, and the ability to share resources and services.

7. User Interfaces
   - Feature: Computers feature various user interfaces, including command-line interfaces (CLI), graphical user interfaces (GUI), and touchscreens.
   - Impact: These interfaces make computers accessible and usable by people with varying levels of technical expertise.

8. Multitasking and Parallel Processing
   - Feature: Computers can handle multiple tasks simultaneously (multitasking) and perform parallel processing with multiple processors or cores.
   - Impact: This capability enhances productivity by allowing users to run several applications or processes at the same time.

9. Reliability and Accuracy
   - Feature: Computers are designed to perform tasks with a high degree of accuracy and reliability, minimizing errors compared to manual processes.
   - Impact: Reliable and accurate computing is essential for applications requiring precise calculations and consistent performance, such as engineering and scientific research.

10. Scalability
   - Feature: Computers and computer systems can be scaled up or down to meet different needs, from personal computers to large data centers and supercomputers.
   - Impact: Scalability allows organizations to adapt their computing resources to changing demands and workloads.

11. Automation of Repetitive Tasks
   - Feature: Computers can automate repetitive and routine tasks, such as data entry, processing, and reporting.
   - Impact: This automation reduces manual labor, minimizes errors, and improves efficiency.

12. Integration with Other Technologies
   - Feature: Computers integrate with various other technologies, such as sensors, robotics, and artificial intelligence (AI).
   - Impact: This integration enables the development of advanced systems and applications, including smart devices, autonomous vehicles, and intelligent systems.

13. Customization and Adaptability
   - Feature: Computers can be customized with different software and hardware components to meet specific needs and preferences.
   - Impact: This adaptability allows users and organizations to tailor computing systems to their particular requirements and applications.

These features collectively represent the transformative impact of computer technology on modern life, enabling advancements in numerous fields, improving efficiency, and expanding the possibilities for innovation and problem-solving.The invention and development of computers have introduced numerous features that have significantly transformed various aspects of society, industry, and daily life. Here are some key features and characteristics associated with the invention of computers:

1. Automated Calculation
   - Feature: Computers automate the process of performing calculations and processing data.
   - Impact: This capability significantly speeds up mathematical computations and data analysis compared to manual methods.

2. Programmability
   - Feature: Computers can be programmed to perform a wide range of tasks based on instructions provided by users.
   - Impact: This flexibility allows computers to execute various applications, from simple calculations to complex simulations and data processing.

3. Storage Capacity
   - Feature: Computers can store large amounts of data and information in various forms, including files, databases, and cloud storage.
   - Impact: This feature enables users to manage, retrieve, and organize vast amounts of data efficiently.

4. Speed and Efficiency
   - Feature: Computers process data and perform operations at incredibly high speeds, far exceeding human capabilities.
   - Impact: Increased speed and efficiency lead to faster decision-making, problem-solving, and productivity in various fields.

5. Data Processing and Analysis
   - Feature: Computers can process and analyze data, performing tasks such as sorting, filtering, and statistical analysis.
   - Impact: This ability is crucial for tasks in scientific research, business analytics, finance, and more.

6. Connectivity and Networking
   - Feature: Computers can connect to other computers and networks, enabling communication and data exchange over local and global networks (e.g., the internet).
   - Impact: This connectivity facilitates collaboration, access to information, and the ability to share resources and services.

7. User Interfaces
   - Feature: Computers feature various user interfaces, including command-line interfaces (CLI), graphical user interfaces (GUI), and touchscreens.
   - Impact: These interfaces make computers accessible and usable by people with varying levels of technical expertise.

8. Multitasking and Parallel Processing
   - Feature: Computers can handle multiple tasks simultaneously (multitasking) and perform parallel processing with multiple processors or cores.
   - Impact: This capability enhances productivity by allowing users to run several applications or processes at the same time.

9. Reliability and Accuracy
   - Feature: Computers are designed to perform tasks with a high degree of accuracy and reliability, minimizing errors compared to manual processes.
   - Impact: Reliable and accurate computing is essential for applications requiring precise calculations and consistent performance, such as engineering and scientific research.

10. Scalability
   - Feature: Computers and computer systems can be scaled up or down to meet different needs, from personal computers to large data centers and supercomputers.
   - Impact: Scalability allows organizations to adapt their computing resources to changing demands and workloads.

11. Automation of Repetitive Tasks
   - Feature: Computers can automate repetitive and routine tasks, such as data entry, processing, and reporting.
   - Impact: This automation reduces manual labor, minimizes errors, and improves efficiency.

12. Integration with Other Technologies
   - Feature: Computers integrate with various other technologies, such as sensors, robotics, and artificial intelligence (AI).
   - Impact: This integration enables the development of advanced systems and applications, including smart devices, autonomous vehicles, and intelligent systems.

13. Customization and Adaptability
   - Feature: Computers can be customized with different software and hardware components to meet specific needs and preferences.
   - Impact: This adaptability allows users and organizations to tailor computing systems to their particular requirements and applications.

These features collectively represent the transformative impact of computer technology on modern life, enabling advancements in numerous fields, improving efficiency, and expanding the possibilities for innovation and problem-solving.`;
        } else if (userInput.includes('what are the ict gadget')|| (userInput.includes('name the ict gadget'))) {
            response = `ICT gadgets are electronic devices and tools that facilitate the management, processing, and communication of information. They play a crucial role in modern Information and Communication Technology (ICT) infrastructure. Here are some common ICT gadgets:

 1. Computers
   - Desktops: Stationary computers with a separate monitor, keyboard, and mouse.
   - Laptops: Portable computers with an integrated screen, keyboard, and trackpad or mouse.
   - Tablets: Touchscreen devices that can be used with or without a keyboard.

 2. Smartphones
   - Mobile Phones: Handheld devices that combine telephony with a range of functionalities, including internet access, email, and apps.

 3. Printers and Scanners
   - Printers: Devices that produce physical copies of digital documents or images.
   - Scanners: Devices that convert physical documents or images into digital formats.

 4. Networking Devices
   - Routers: Devices that direct data traffic between networks and connect multiple devices to the internet.
   - Modems: Devices that modulate and demodulate signals for internet connectivity.
   - Switches: Devices that manage and direct data traffic within a local network.

 5. Storage Devices
   - External Hard Drives: Portable devices used for storing and backing up large amounts of data.
   - USB Flash Drives: Small, portable devices used for transferring and storing data.

 6. Projectors
   - Digital Projectors: Devices that project digital images or videos onto a screen or surface for presentations and multimedia applications.

 7. Webcams
   - Web Cameras: Devices that capture video and images for video conferencing, streaming, and recording.

 8. Smartwatches
   - Wearable Devices: Smartwatches that provide notifications, track health metrics, and integrate with smartphones.

 9. Voice Assistants and Smart Speakers
   - Voice-Activated Devices: Gadgets like Amazon Echo, Google Home, and Apple HomePod that use voice commands to perform tasks and provide information.

 10. Headphones and Earbuds
   - Audio Devices: Gadgets used for listening to audio, including wired and wireless options.

 11. Digital Cameras
   - Cameras: Devices for capturing digital images and videos, often with advanced features for photography and videography.

 12. Smart TVs
   - Televisions: Televisions with internet connectivity and applications for streaming media and accessing online content.

 13. Virtual Reality (VR) Headsets
   - VR Devices: Gadgets that provide immersive virtual experiences through headsets and motion sensors.

 14. Smart Home Devices
   - IoT Gadgets: Devices such as smart thermostats, smart lights, and smart locks that can be controlled remotely via smartphones or voice commands.

 15. GPS Devices
   - Navigation Tools: Gadgets that provide location tracking and navigation assistance using satellite signals.

 16. Educational and Assistive Technologies
   - Educational Gadgets: Devices designed to enhance learning, such as interactive whiteboards and e-learning tools.
   - Assistive Technologies: Gadgets that support individuals with disabilities, such as screen readers and speech recognition software.

These ICT gadgets are integral to personal, educational, and professional environments, enhancing productivity, communication, and access to information.`;
        } else if (userInput.includes('the invention of computer started in which centuries')) {
            response = `The invention and development of computers began in earnest in the late 17th century and continued through the 20th century. Here’s a breakdown of key milestones across centuries:

 17th Century
- 1642: Blaise Pascal invented the Pascaline, an early mechanical calculator for addition and subtraction.

 18th Century
- 1770s: Gottfried Wilhelm Leibniz developed the Stepped Reckoner, which could perform multiplication and division, building on Pascal’s work.

 19th Century
- 1830s: Charles Babbage conceptualized the Analytical Engine, an early design for a mechanical general-purpose computer, though it was never completed during his lifetime.
- 1850s: The development of the Difference Engine, another mechanical calculator by Babbage, which was intended for calculating mathematical tables.

 Early 20th Century
- 1930s: Alan Turing proposed the Turing Machine, laying the theoretical groundwork for modern computing.
- 1937-1942: John Atanasoff and Clifford Berry developed the Atanasoff-Berry Computer (ABC), an early electronic computer.
- 1941: Konrad Zuse built the Z3, an early programmable computer using electromechanical relays.

 Mid 20th Century
- 1943-1944: The Colossus was developed in the UK for codebreaking during World War II, one of the first electronic digital computers.
- 1945: The ENIAC (Electronic Numerical Integrator and Computer) was completed at the University of Pennsylvania. Often considered the first general-purpose electronic digital computer.
- 1946: The EDSAC (Electronic Delay Storage Automatic Calculator), one of the first computers to use a stored program.

 Late 20th Century
- 1950s-1960s: The development of transistors and integrated circuits led to smaller, more reliable computers and the rise of the mainframe and minicomputers.
- 1970s: The introduction of microprocessors enabled the creation of personal computers, leading to the widespread use of computers in homes and businesses.

 21st Century
- Ongoing: Advancements continue with the development of artificial intelligence (AI), quantum computing, and cloud computing, further evolving the capabilities and applications of computers.

The development of computers has been a gradual process with contributions from various inventors and researchers across different centuries, culminating in the sophisticated digital systems we use today.`;
        } else if (userInput.includes('what is data')|| (userInput.includes('define data'))) {
            response = `Data refers to raw facts, figures, or information collected through various means. It can be qualitative or quantitative and is the fundamental input for analysis and decision-making in various fields.

 Types of Data

1. Quantitative Data:
   - Definition: Numerical data that can be measured and quantified.
   - Examples: Age, height, temperature, sales figures, test scores.

2. Qualitative Data:
   - Definition: Descriptive data that can be categorized based on attributes or qualities.
   - Examples: Colors, names, opinions, descriptions.

 Characteristics of Data

1. Raw: Data in its unprocessed form, not yet analyzed or interpreted.
2. Structured: Data organized into a predefined format, such as tables or spreadsheets (e.g., databases).
3. Unstructured: Data not organized in a predefined manner, such as text documents, images, and social media posts.
4. Semi-structured: Data that has some organizational properties but does not fit neatly into tables (e.g., JSON files, XML).

 Uses of Data

1. Decision-Making: Data provides insights and information that help individuals and organizations make informed decisions.
2. Analysis: Data is analyzed to identify trends, patterns, and relationships.
3. Reporting: Data is used to generate reports and dashboards that communicate findings and performance metrics.
4. Prediction: Data helps in forecasting future trends and outcomes through statistical and machine learning models.
5. Research: Data is fundamental for conducting research and experiments across various fields, such as science, social science, and economics.

 Data Processing Steps

1. Collection: Gathering data from various sources, such as surveys, sensors, or transactions.
2. Storage: Saving data in databases or data warehouses for future access and use.
3. Cleaning: Removing errors, inconsistencies, and irrelevant information to ensure data quality.
4. Analysis: Examining and interpreting data to extract meaningful insights.
5. Visualization: Presenting data in graphical formats like charts, graphs, and maps to make it easier to understand.
6. Reporting: Creating reports and summaries based on data analysis to communicate findings to stakeholders.

Data is a crucial asset in today's information-driven world, enabling advancements in technology, business, science, and many other areas.`;
        } else if (userInput.includes('types of data')|| (userInput.includes('list tha types of data'))) {
            response = `Data can be categorized into several types based on its characteristics and usage. Here are the main types of data:

 1. Quantitative Data

   Definition: Numerical data that can be measured and quantified. 

   Types:
   - Discrete Data: Countable data, often integers, where each value is distinct (e.g., number of students, number of cars).
   - Continuous Data: Data that can take any value within a range and is usually measured (e.g., height, weight, temperature).

 2. Qualitative Data

   Definition: Descriptive data that can be categorized based on attributes or qualities.

   Types:
   - Nominal Data: Categories without a natural order (e.g., colors, names, types of fruit).
   - Ordinal Data: Categories with a natural order or ranking (e.g., customer satisfaction levels, educational grades).

 3. Structured Data

   Definition: Data that is organized into a predefined format, making it easily searchable and analyzable.

   Examples: Databases, spreadsheets, and tabular data where each element fits into rows and columns.

 4. Unstructured Data

   Definition: Data that does not have a predefined format or organization, making it more challenging to analyze.

   Examples: Text documents, emails, social media posts, images, and videos.

 5. Semi-Structured Data

   Definition: Data that has some organizational properties but does not fit neatly into tables or databases.

   Examples: JSON files, XML files, and logs where data is organized but not strictly in a tabular format.

 6. Metadata

   Definition: Data about data. It provides information about other data, such as its source, format, and context.

   Examples: File properties (size, creation date), database schema, and data dictionaries.

 7. Operational Data

   Definition: Data generated from day-to-day business operations.

   Examples: Sales transactions, inventory levels, customer service interactions.

 8. Analytical Data

   Definition: Data used for analysis and decision-making, often derived from operational data.

   Examples: Sales trends, customer behavior patterns, and performance metrics.

 9. Transactional Data

   Definition: Data related to transactions or business activities.

   Examples: Purchase orders, invoices, and payment records.

 10. Big Data

   Definition: Extremely large datasets that are difficult to process and analyze using traditional methods due to their volume, velocity, and variety.

   Examples: Social media interactions, sensor data, and web logs.

 11. Real-Time Data

   Definition: Data that is collected and processed immediately as it is generated.

   Examples: Stock market prices, traffic updates, and live streaming data.

Understanding these types of data helps in selecting the appropriate tools and techniques for data collection, storage, analysis, and visualization.`;
        } else if (userInput.includes('classification of information')|| (userInput.includes('state the classification of information'))) {
            response = `Information can be classified in various ways based on its nature, purpose, and use. Here are some common classifications:

 1. By Nature

   a. Qualitative Information:
   - Definition: Descriptive information that provides insights into qualities or characteristics.
   - Examples: Customer feedback, product reviews, and descriptive statistics.

   b. Quantitative Information:
   - Definition: Numerical information that can be measured and analyzed statistically.
   - Examples: Sales figures, temperature readings, and performance metrics.

 2. By Purpose

   a. Operational Information:
   - Definition: Information used to manage day-to-day operations and routine activities.
   - Examples: Inventory levels, transaction records, and employee schedules.

   b. Strategic Information:
   - Definition: Information used for long-term planning and decision-making at the strategic level.
   - Examples: Market trends, competitive analysis, and business forecasts.

   c. Tactical Information:
   - Definition: Information used for mid-term planning and decision-making.
   - Examples: Project plans, departmental budgets, and performance evaluations.

 3. By Source

   a. Primary Information:
   - Definition: Information collected directly from original sources.
   - Examples: Surveys, experiments, and interviews.

   b. Secondary Information:
   - Definition: Information obtained from sources that have already processed or analyzed primary data.
   - Examples: Research reports, articles, and statistical databases.

 4. By Format

   a. Textual Information:
   - Definition: Information presented in written form.
   - Examples: Documents, reports, emails, and articles.

   b. Numerical Information:
   - Definition: Information presented in numerical form.
   - Examples: Tables, charts, and graphs.

   c. Visual Information:
   - Definition: Information presented through images, diagrams, and videos.
   - Examples: Infographics, photographs, and video presentations.

 5. By Accessibility

   a. Public Information:
   - Definition: Information available to everyone and not restricted.
   - Examples: News articles, public records, and general knowledge.

   b. Private Information:
   - Definition: Information restricted to specific individuals or groups.
   - Examples: Personal data, confidential business documents, and internal communications.

   c. Sensitive Information:
   - Definition: Information that requires special handling due to its nature.
   - Examples: Financial records, medical records, and trade secrets.

 6. By Accuracy and Reliability

   a. Reliable Information:
   - Definition: Information that is accurate, trustworthy, and verifiable.
   - Examples: Well-sourced research findings, official statistics, and credible news reports.

   b. Unreliable Information:
   - Definition: Information that is questionable in terms of accuracy and validity.
   - Examples: Rumors, unverified online content, and biased reports.

 7. By Level of Detail

   a. Detailed Information:
   - Definition: In-depth information providing comprehensive insights.
   - Examples: Technical specifications, detailed reports, and case studies.

   b. Summary Information:
   - Definition: Concise information providing an overview or key points.
   - Examples: Executive summaries, abstracts, and overview presentations.

Understanding these classifications helps in managing, organizing, and utilizing information effectively for various purposes.`;
         } else if (userInput.includes('define a function')) {
            response = 'A function is a relation between a set of inputs and a set of permissible outputs, where each input is related to exactly one output.';
         } else if (userInput.includes('what is an integral')) {
            response = 'An integral is a mathematical object that represents the area under a curve or the accumulation of quantities.';
         } else if (userInput.includes('what is a derivative')) {
            response = 'A derivative represents the rate at which a function is changing at any given point.';
         } else if (userInput.includes('what is a matrix')) {
            response = 'A matrix is a rectangular array of numbers or other mathematical objects for which operations such as addition and multiplication are defined."';
         } else if (userInput.includes('what is a vector')||(userInput.includes('what is vector'))) {
            response = 'The term "vector" has different meanings in various fields, including mathematics, physics, biology, and computer science';
         } else if (userInput.includes('define probability')) {
            response = 'Probability is the measure of the likelihood that an event will occur.';
         } else if (userInput.includes('what is a permutation')) {
            response = 'A permutation is an arrangement of objects in a specific order.';
         } else if (userInput.includes('what is a combination')) {
            response = 'A combination is a selection of items from a larger pool where order does not matter.';
         } else if (userInput.includes('what is a logarithm')) {
            response = 'A logarithm is the exponent by which a base must be raised to yield a given number.';
         } else if (userInput.includes('what is an asymptote')) {
            response = 'An asymptote is a line that a curve approaches but never touches.';
         } else if (userInput.includes('define a polynomial')) {
            response = 'A polynomial is an algebraic expression consisting of variables and coefficients, involving only addition, subtraction, multiplication, and non-negative integer exponents.';
         } else if (userInput.includes('what is an arithmetic sequence')) {
            response = 'An arithmetic sequence is a sequence of numbers in which the difference between consecutive terms is constant.';
         } else if (userInput.includes('what is a geometric sequence')) {
            response = 'A geometric sequence is a sequence of numbers in which each term after the first is found by multiplying the previous term by a fixed, non-zero number.';
         } else if (userInput.includes('define a circle')) {
            response = 'A circle is a shape consisting of all points in a plane that are a given distance from a given point, the center.';
         } else if (userInput.includes('what is a parabola')) {
            response = 'A parabola is a symmetrical open plane curve formed by the intersection of a cone with a plane parallel to its side.';
         } else if (userInput.includes('what is the slope of a line')) {
            response = 'The slope of a line is the measure of its steepness, usually denoted by the letter \'m\' and calculated as the change in y over the change in x.';
         } else if (userInput.includes('what is the area of a triangle')) {
            response = 'The area of a triangle is given by the formula 1/2  base  height.';


        } else if (userInput.includes('what is a vector quantity')||(userInput.includes('what is vector quantity'))) {
            response = `A vector quantity is a type of physical quantity that has both magnitude and direction. It differs from a scalar quantity, which only has magnitude (like temperature or mass). Common examples of vector quantities include:

- Velocity: Describes both the speed and direction of an object's motion.
- Force: Involves how strong a push or pull is and the direction in which it acts.
- Acceleration: Shows how the velocity of an object is changing in both magnitude and direction.

Vectors are often represented graphically by arrows, where the length represents the magnitude and the direction of the arrow represents the direction of the vector.`;
        } else if (userInput.includes('what is scaler quantity')||(userInput.includes('what is a scaler quantity'))) {
            response = `A scalar quantity is a type of physical quantity that has only magnitude and no direction. Unlike vector quantities, scalar quantities are completely described by a single number, representing their size or value. Common examples of scalar quantities include:

- Temperature: Indicates how hot or cold something is, but has no direction.
- Mass: The amount of matter in an object, regardless of where or how it's positioned.
- Time: The duration of an event, which only has magnitude.
- Speed: The rate of motion, which does not specify the direction (unlike velocity, which is a vector).

Scalar quantities are straightforward and don't require additional information about direction to be fully understood.`;
        } else if (userInput.includes('types of vector quantity')||(userInput.includes('examples of scaler quantity'))) {
            response = `There are different types of vector quantities based on their nature and application. The main types include:

1. Displacement
   - Definition: Refers to the change in position of an object from one point to another, considering both the distance and the direction.
   - Example: Moving 5 meters east from the starting point.

2. Velocity
   - Definition: The rate of change of displacement with time, specifying both speed and direction.
   - Example: A car moving at 60 km/h to the north.

3. Acceleration
   - Definition: The rate of change of velocity with time.
   - Example: A car accelerating at 3 m/s² to the east.

4. Force
   - Definition: A push or pull acting upon an object that causes it to move, change direction, or change shape.
   - Example: Pulling an object to the right with a force of 10 Newtons.

5. Momentum
   - Definition: The product of an object's mass and velocity, representing the quantity of motion an object has.
   - Example: A 10 kg object moving at 2 m/s has a momentum of 20 kg·m/s in the direction of its motion.

6. Weight
   - Definition: The force exerted by gravity on an object, directed toward the center of the Earth (or any other celestial body).
   - Example: An object with a mass of 50 kg has a weight of approximately 490 Newtons downward.

7. Electric Field
   - Definition: A region around a charged particle where a force would be exerted on other charged particles.
   - Example: The electric field around a positively charged particle pointing radially outward.

8. Magnetic Field
   - Definition: A region around a magnet where magnetic forces can be felt, represented by field lines with direction.
   - Example: The magnetic field around a bar magnet, where the field lines emerge from the north pole and enter the south pole.

Each of these vector quantities not only has a magnitude but also requires a direction to be fully described.`;
        } else if (userInput.includes('branches of physics')||(userInput.includes('branches of physics'))) {
            response = `Physics is a broad field of science that studies the fundamental principles of nature. It is divided into various branches based on the specific areas of study. Here are some of the main branches of physics:

 1. Classical Mechanics
   - Focus: The study of the motion of objects and the forces that cause this motion.
   - Key Topics: Newton's laws of motion, kinematics, dynamics, energy, momentum, and gravity.

 2. Thermodynamics
   - Focus: The study of heat, energy, and the conversion of energy between different forms.
   - Key Topics: Temperature, heat transfer, entropy, and the laws of thermodynamics.

 3. Electromagnetism
   - Focus: The study of electric and magnetic fields, and their effects on matter.
   - Key Topics: Electric charges, electric and magnetic fields, electromagnetism, and Maxwell's equations.

 4. Optics
   - Focus: The study of light and its interactions with matter.
   - Key Topics: Reflection, refraction, diffraction, lenses, and the behavior of electromagnetic waves.

 5. Quantum Mechanics
   - Focus: The study of the behavior of particles at the atomic and subatomic levels.
   - Key Topics: Wave-particle duality, uncertainty principle, quantum states, and quantum entanglement.

 6. Relativity
   - Focus: The study of objects moving at speeds close to the speed of light, and the effects of gravity on space and time.
   - Key Topics: Special relativity, general relativity, time dilation, and the curvature of spacetime.

 7. Nuclear Physics
   - Focus: The study of the components and behavior of atomic nuclei.
   - Key Topics: Radioactivity, nuclear reactions, nuclear decay, and nuclear energy.

 8. Atomic Physics
   - Focus: The study of atoms, particularly their electron structures and energy levels.
   - Key Topics: Electron configuration, ionization, spectroscopy, and atomic models.

 9. Condensed Matter Physics
   - Focus: The study of the properties of matter in solid and liquid states.
   - Key Topics: Crystallography, superconductivity, semiconductors, and magnetism.

 10. Astrophysics
   - Focus: The study of the physical properties and behavior of celestial bodies and the universe as a whole.
   - Key Topics: Stars, galaxies, black holes, cosmology, and the Big Bang.

 11. Plasma Physics
   - Focus: The study of ionized gases and plasmas, the fourth state of matter.
   - Key Topics: Plasma waves, fusion energy, and magnetic confinement.

 12. Geophysics
   - Focus: The study of the physical properties and processes of the Earth.
   - Key Topics: Seismology, plate tectonics, volcanology, and the Earth's magnetic field.

 13. Biophysics
   - Focus: The application of physics principles to biological systems.
   - Key Topics: Molecular dynamics, neural networks, biomechanics, and medical physics.

 14. High Energy Physics (Particle Physics)
   - Focus: The study of fundamental particles and the forces that govern their interactions.
   - Key Topics: Quarks, leptons, the Standard Model, particle accelerators, and the Higgs boson.

 15. Acoustics
   - Focus: The study of sound waves, their propagation, and interaction with matter.
   - Key Topics: Vibrations, sound transmission, resonance, and ultrasonic waves.

These branches of physics are often interconnected, and advances in one field can lead to breakthroughs in others. Physics continues to evolve, exploring the fundamental workings of the universe.`;
        } else if (userInput.includes('who is your mother')||(userInput.includes('what is your mothers name'))) {
            response = `You are mad Dose AI have mother, but a creator`;

     }else if (userInput.includes('did you know about sex')) {
            response = 'yes i know that but dont ask me about that again if that i will course you';
     } else if (userInput.includes('periodic table')) {
         response = "The periodic table is a tabular arrangement of chemical elements based on their atomic number, electron configuration, and recurring chemical properties.";
     } else if (userInput.includes('what is an isotope')) {
         response = "An isotope is a variant of a chemical element that has the same number of protons but a different number of neutrons in its nucleus.";
     } else if (userInput.includes('who discovered penicillin')) {
         response = "Penicillin was discovered by Alexander Fleming in 1928.";
     } else if (userInput.includes('what is the pH scale') ||(userInput.includes('what is ph scale'))) {
         response = "The pH scale measures how acidic or basic a solution is, ranging from 0 (very acidic) to 14 (very basic), with 7 being neutral.";
        } else if (userInput.includes('gini bu ndabosky') ||(userInput.includes('what is indabosky'))) {
            response = "indabosky bu ndagbuo gi said by OdumEje";
    
     // Physics
     } else if (userInput.includes('what is the speed of light')) {
         response = "The speed of light is approximately 299,792 kilometers per second (or about 186,282 miles per second).";
     } else if (userInput.includes('newton\'s second law')) {
         response = "Newton's second law states that Force equals mass times acceleration (F = ma).";
     } else if (userInput.includes('what is gravity')) {
         response = "Gravity is a force that attracts two bodies towards each other, proportional to their masses and inversely proportional to the square of the distance between their centers.";
     } else if (userInput.includes('what is quantum mechanics')) {
         response = "Quantum mechanics is a fundamental theory in physics that describes nature at the smallest scales of energy levels of atoms and subatomic particles.";
     } else if (userInput.includes('what is the law of conservation of energy')) {
         response = "The law of conservation of energy states that energy cannot be created or destroyed, only transformed from one form to another.";
     } else if (userInput.includes('what is an acid') ||(userInput.includes('define acid'))||(userInput.includes('what is acid'))) {
         response= 'An acid is a substance that donates protons (H+) and increases the concentration of hydrogen ions in a solution.';
     } else if (userInput.includes('what is a base')) {
         response = 'A base is a substance that accepts protons (H+) and decreases the concentration of hydrogen ions in a solution.';
     // Christian Religion
     } else if (userInput.includes('who is jesus christ')) {
         response = "Jesus Christ is a central figure in Christianity, believed to be the Son of God and the awaited Messiah.";
     } else if (userInput.includes('what is the bible')||(userInput.includes('what is bible'))) {
         response = "The Bible is a collection of sacred texts or scriptures in Christianity, divided into the Old Testament and the New Testament.";
     } else if (userInput.includes('what is the holy trinity')) {
         response = "The Holy Trinity in Christianity refers to the concept of God as three persons in one essence: God the Father, God the Son (Jesus Christ), and God the Holy Spirit.";
     } else if (userInput.includes('what are the ten commandments')||(userInput.includes('what are the ten commandments of jesus'))) {
         response = "The Ten Commandments are a set of biblical principles relating to ethics and worship, which play a fundamental role in Judaism and Christianity.";
     } else if (userInput.includes('what is salvation')) {
         response = "In Christianity, salvation is the deliverance from sin and its consequences, believed by Christians to be brought about by faith in Christ.";
 
     // Geography
     
     } else if (userInput.includes('largest desert')||(userInput.includes('what is the largest desert'))) {
         response = "The largest desert in the world is the Antarctic Desert.";
     } else if (userInput.includes('what is the solar system')||(userInput.includes('define the solar system'))) {
         response = `The solar system is a gravitationally bound system that consists of the Sun and all the objects that orbit it, either directly or indirectly. Here are the main components and key characteristics of the solar system:
 
 1. responseThe Sunresponse:
    - The Sun is a star at the center of the solar system and contains about 99.86% of its total mass.
    - It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process.
 
 2. responsePlanetsresponse:
    - There are eight recognized planets in the solar system, divided into two categories:
      - responseTerrestrial Planetsresponse: These are rocky and include Mercury, Venus, Earth, and Mars.
      - responseGas Giantsresponse: These are much larger and composed mostly of gases. They include Jupiter and Saturn.
      - responseIce Giantsresponse: Similar to gas giants but with more ices (water, ammonia, methane). They include Uranus and Neptune.
 
 3. responseDwarf Planetsresponse:
    - Dwarf planets are similar to regular planets but do not dominate their orbits. Notable dwarf planets include Pluto, Eris, Haumea, Makemake, and Ceres.
 
 4. responseMoonsresponse:
    - Natural satellites that orbit planets and dwarf planets. Earth’s Moon, Jupiter’s Ganymede, and Saturn’s Titan are some of the largest.
 
 5. responseAsteroidsresponse:
    - Small rocky bodies, primarily found in the asteroid belt between Mars and Jupiter. Some notable asteroids include Ceres (also classified as a dwarf planet), Vesta, and Pallas.
 
 6. responseCometsresponse:
    - Composed of ice, dust, and rocky material. They have highly elliptical orbits that bring them close to the Sun, causing them to develop glowing comas and tails.
 
 7. responseKuiper Belt and Oort Cloudresponse:
    - The Kuiper Belt is a region beyond Neptune filled with small icy bodies, including dwarf planets like Pluto.
    - The Oort Cloud is a theoretical distant spherical shell of icy objects surrounding the solar system, believed to be the source of long-period comets.
 
 8. responseMeteoroidsresponse:
    - Small rocky or metallic bodies in space. When they enter Earth’s atmosphere and burn up, they are called meteors. If they reach the ground, they are termed meteorites.
 
 9. responseThe Heliopauseresponse:
    - The boundary of the Sun's influence, where the solar wind meets the interstellar medium. It marks the outer edge of the heliosphere.
 
 10. responseOther Featuresresponse:
     - responseSolar Windresponse: A stream of charged particles released from the upper atmosphere of the Sun, affecting the entire solar system.
     - responseMagnetic Fieldsresponse: Various objects, including the Sun and planets like Earth and Jupiter, have magnetic fields that influence their surroundings.
 
 response Structure and Formation
 
 - The solar system formed about 4.6 billion years ago from the gravitational collapse of a giant molecular cloud.
 - The Sun formed at the center, and the remaining material flattened into a protoplanetary disk, from which the planets, moons, and other bodies formed.
 
 response Exploration
 
 - The solar system has been extensively studied by telescopes and space missions.
 - Notable missions include the Voyager probes, which have traveled beyond the outer planets, and the Mars rovers, which have provided detailed information about the Martian surface.
 
 Understanding the solar system helps scientists learn about the formation and evolution of planetary systems and provides insights into the potential for life elsewhere in the universe.`;
     } else if (userInput.includes('longest river in the world')) {
         response = "The Nile River is often considered the longest river in the world, though some sources argue that the Amazon River is longer.";
     } else if (userInput.includes('highest mountain in the world')) {
         response = "The highest mountain in the world is Mount Everest, which stands at 8,848 meters (29,029 feet) above sea level.";
     } else if (userInput.includes('what is the equator')) {
         response = "The equator is an imaginary line that divides the Earth into the Northern and Southern Hemispheres, situated equidistant from the North and South Poles.";
 
     // Biology
     } else if (userInput.includes('what is DNA')) {
         response = "DNA (deoxyribonucleic acid) is the molecule that carries genetic instructions in all living things.";
     } else if (userInput.includes('function of the heart')) {
         response = "The function of the heart is to pump blood throughout the body, supplying oxygen and nutrients and removing carbon dioxide and waste products.";
     } else if (userInput.includes('what is photosynthesis')) {
         response = "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.";
     } else if (userInput.includes('what are chromosomes')) {
         response = "Chromosomes are long DNA molecules with part or all of the genetic material of an organism, found in the nucleus of eukaryotic cells.";
     } else if (userInput.includes('what is cellular respiration')) {
         response = "Cellular respiration is the process by which cells convert glucose and oxygen into energy, carbon dioxide, and water.";
        } else if (userInput.includes('types of marriage')) {
            response = `There are several types of marriage, including:
            \n1. Monogamy: Marriage to one person at a time.
            \n2. Polygamy: Marriage involving multiple spouses, which can be subdivided into:
            \n   - Polygyny: One man married to multiple women.
            \n   - Polyandry: One woman married to multiple men.
            \n3. Group Marriage: A marriage involving multiple husbands and wives.
            \n4. Arranged Marriage: A marriage planned and agreed to by the families or guardians of the couple.
            \n5. Civil Marriage: A marriage recognized by the state or government.`;
     // Civic Education
     } else if (userInput.includes('what is democracy')) {
         response = "Democracy is a system of government where the citizens exercise power by voting.";
      }else if (userInput.includes('what is marriage')) {
            response = `Marriage is a legally or formally recognized union of two people as partners in a personal relationship. There are several types of marriage, including:
            \n1. Monogamy: Marriage to one person at a time.
            \n2. Polygamy: Marriage involving multiple spouses, which can be subdivided into:
            \n   - Polygyny: One man married to multiple women.
            \n   - Polyandry: One woman married to multiple men.
            \n3. Group Marriage: A marriage involving multiple husbands and wives.
            \n4. Arranged Marriage: A marriage planned and agreed to by the families or guardians of the couple.
            \n5. Civil Marriage: A marriage recognized by the state or government.`;
        } else if (userInput.includes('types of mountains')) {
            response = `Mountains are classified based on their formation processes:
            \n1. Fold Mountains: Formed by the folding of Earth's crust (e.g., Himalayas).
            \n2. Fault-block Mountains: Formed by the breaking and tilting of Earth's crust (e.g., Sierra Nevada).
            \n3. Volcanic Mountains: Formed by volcanic activity (e.g., Mount Fuji).
            \n4. Dome Mountains: Formed when magma pushes the crust upwards (e.g., Black Hills).
            \n5. Plateau Mountains: Formed by erosion of an elevated area (e.g., Catskill Mountains).`;
     } else if (userInput.includes('what is the role of government')) {
         response = "The role of government is to create and enforce laws, maintain order, and provide public services for the welfare of its citizens.";
     } else if (userInput.includes('what is the Constitution')) {
         response = "The Constitution is a set of fundamental principles or established precedents according to which a state or other organization is governed.";
     } else if (userInput.includes('what are civil rights')) {
         response = "Civil rights are the rights of citizens to political and social freedom and equality.";
     } else if (userInput.includes('what is a republic') ||(userInput.includes('what is republic'))) {
         response = "A republic is a form of government in which the country is considered a 'public matter,' and the head of state is elected or appointed, rather than a monarch.";
 
     // Data Processing
     } else if (userInput.includes('what is data processing')) {
         response = "Data processing is the collection and manipulation of data to produce meaningful information.";
     } else if (userInput.includes('types of data processing')) {
         response = "Types of data processing include batch processing, real-time processing, and online processing.";
     } else if (userInput.includes('what is a database')) {
         response = "A database is an organized collection of structured information or data, typically stored electronically in a computer system.";
     } else if (userInput.includes('what is big data')) {
         response = "Big data refers to large and complex data sets that traditional data processing software cannot adequately handle.";
     } else if (userInput.includes('what is data mining')) {
         response = "Data mining is the process of discovering patterns and knowledge from large amounts of data.";
 
     // Mathematics
     } else if (userInput.includes('what is the Pythagorean theorem')) {
         response = "The Pythagorean theorem states that in a right-angled triangle, the square of the length of the hypotenuse is equal to the sum of the squares of the lengths of the other two sides.";
     } else if (userInput.includes('what is a prime number')) {
         response = "A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.";
     } else if (userInput.includes('what is an integer')) {
         response = "An integer is a whole number that can be positive, negative, or zero, but not a fraction or decimal.";
     } else if (userInput.includes('what is a quadratic equation')) {
         response = "A quadratic equation is a second-degree polynomial equation in the form ax^2 + bx + c = 0.";
     } else if (userInput.includes('what is a factorial')) {
         response = "A factorial, denoted by n!, is the product of all positive integers less than or equal to n.";
     } else if (userInput.includes('who build you')) {
         response = `i was build by a scientist named "EGBUJI DAVID KENECHUKWU"`;
 
     // English
     } else if (userInput.includes('types of programming language are') || (userInput.includes('list any types of programming language we have'))) {
         response = `There are numerous programming languages, each designed for specific types of tasks and environments. Here's a comprehensive list of some of the most notable programming languages along with their primary purposes:
 
  Popular Programming Languages
 
 1. Python
    - Purpose: General-purpose, high-level programming language known for its readability and simplicity. Widely used in web development, data analysis, artificial intelligence, scientific computing, and automation.
 
 2. JavaScript
    - Purpose: A versatile language primarily used for web development to create interactive web pages. It is executed in the browser and used for client-side scripting.
 
 3. Java
    - Purpose: A high-level, object-oriented language used in web applications, mobile applications (Android), enterprise software, and large systems. Known for its portability across platforms due to the Java Virtual Machine (JVM).
 
 4. C
    - Purpose: A foundational programming language used for system programming, operating systems, and embedded systems. Known for its performance and low-level memory access.
 
 5. C++
    - Purpose: An extension of C that includes object-oriented features. Used in software development for performance-critical applications, such as games and real-time systems.
 
 6. C
    - Purpose: Developed by Microsoft, it's used for developing Windows applications, web applications, and games (using Unity). Known for its simplicity and integration with the .NET framework.
 
 7. Ruby
    - Purpose: Known for its elegant syntax, Ruby is often used in web development, particularly with the Ruby on Rails framework. It emphasizes developer happiness and productivity.
 
 8. PHP
    - Purpose: A server-side scripting language primarily used for web development. It can be embedded into HTML and is widely used for creating dynamic web pages and applications.
 
 9. Swift
    - Purpose: Developed by Apple for iOS and macOS development. It's known for its performance and safety features and is used to build apps for Apple's ecosystem.
 
 10. Go (Golang)
     - Purpose: Developed by Google, Go is designed for system programming and scalable network applications. It emphasizes simplicity, efficiency, and performance.
 
 11. Rust
     - Purpose: A systems programming language focused on safety and performance. It provides memory safety without a garbage collector and is used in performance-critical applications.
 
 12. Kotlin
     - Purpose: Developed by JetBrains and officially supported for Android development. Kotlin is designed to be fully interoperable with Java while providing a more concise and expressive syntax.
 
 13. TypeScript`;
 }else if (userInput.includes('what is length')) {
     response = "Length is a measure of distance. Its SI unit is meter (m).";
 }else if (userInput.includes('what is a polygon')) {
     response = `A polygon is a two-dimensional geometric shape that is formed by connecting a finite number of straight line segments end-to-end to create a closed figure. The line segments, known as sides or edges, meet at points called vertices (or corners). Polygons can vary widely in terms of the number of sides, shapes, and properties.
 
 Key Characteristics of Polygons:
 Sides:
 
 The straight line segments that form the boundary of the polygon.
 Example: In a triangle, there are 3 sides; in a hexagon, there are 6 sides.
 Vertices:
 
 The points where two sides meet.
 Example: A pentagon has 5 vertices.
 Angles:
 
 The interior angles formed at each vertex where two sides meet.
 Example: A triangle has three interior angles, and the sum of these angles is always 180 degrees.
 Diagonals:
 
 Line segments that connect non-adjacent vertices of the polygon.
 Example: A quadrilateral has two diagonals, while a hexagon has nine diagonals.
 Types of Polygons:
 By Number of Sides:
 
 Triangle: 3 sides.
 Quadrilateral: 4 sides.
 Pentagon: 5 sides.
 Hexagon: 6 sides.
 Heptagon: 7 sides.
 Octagon: 8 sides.
 n-gon: A general term for a polygon with
 𝑛
 n sides.
 By Angle Properties:
 
 Regular Polygon: All sides and angles are equal.
 Example: A regular hexagon has all six sides and angles equal.
 Irregular Polygon: Sides and angles are not necessarily equal.
 Example: An irregular pentagon may have sides of different lengths and angles.
 By Angle Measure:
 
 Convex Polygon: All interior angles are less than 180 degrees, and all vertices point outward.
 Example: A regular pentagon.
 Concave Polygon: At least one interior angle is greater than 180 degrees, and it has at least one vertex that points inward.
 Example: A star-shaped polygon.
 Formulas Related to Polygons:
 Sum of Interior Angles:
 
 For a polygon with
 𝑛
 n sides, the sum of the interior angles is given by:
 Sum of interior angles=(𝑛−2)×180∘Sum of interior angles=(n−2)×180 ∘
 
 Example: For a hexagon (6 sides), the sum of the interior angles is
 (6−2)×180∘=720∘(6−2)×180 ∘=720 ∘.
 Each Interior Angle of a Regular Polygon:
 
 For a regular polygon with
 𝑛
 n sides, each interior angle is given by:
 Each interior angle=(𝑛−2)×180∘𝑛Each interior angle= n(n−2)×180 ∘ Example: For a regular pentagon (5 sides), each interior angle is (5−2)×180∘5=108∘5(5−2)×180 ∘ =108 ∘ .Number of Diagonals:For a polygon with 𝑛n sides, the number of diagonals is given by:Number of diagonals=𝑛(𝑛−3)2Number of diagonals= 2n(n−3) Example: For a hexagon (6 sides), the number of diagonals is 6×(6−3 =9.
 Summary:
 A polygon is a closed geometric figure with straight sides and a specific number of vertices and angles. Polygons can be classified based on the number of sides, angle properties, and whether they are regular or irregular. Understanding polygons is fundamental in geometry, with applications in various fields such as mathematics, engineering, and design.`;
 } else if (userInput.includes('what is mass')) {
     response = "Mass is a measure of the amount of matter in an object. Its SI unit is kilogram (kg).";
 } else if (userInput.includes('who are you')) {
     response = "I am an AI";
    } else if (userInput.includes('what is time')) {
        response = "Time is a measure of the duration of events. Its SI unit is second (s).";
 } else if (userInput.includes('what is electric current')) {
     response = "Electric current is the flow of electric charge. Its SI unit is ampere (A).";
 } else if (userInput.includes('what is temperature')) {
     response = "Temperature is a measure of the average kinetic energy of the particles in a substance. Its SI unit is kelvin (K).";
 } else if (userInput.includes('what is amount of substance')) {
     response = "Amount of substance is a measure of the number of entities (atoms, molecules, etc.) in a sample. Its SI unit is mole (mol).";
 } else if (userInput.includes('what is luminous intensity')) {
     response = "Luminous intensity is a measure of the amount of light emitted in a particular direction. Its SI unit is candela (cd).";
 
 // Derived Quantities
 } else if (userInput.includes('what is area')) {
     response = "Area is a measure of the extent of a surface. Its SI unit is square meter (m²).";
 } else if (userInput.includes('what is volume')) {
     response = "Volume is a measure of the amount of space an object occupies. Its SI unit is cubic meter (m³).";
 } else if (userInput.includes('what is speed')) {
     response = "Speed is the rate at which an object covers distance. Its SI unit is meter per second (m/s).";
 } else if (userInput.includes('what is velocity')) {
     response = "Velocity is the speed of an object in a specific direction. Its SI unit is meter per second (m/s).";
 } else if (userInput.includes('what is acceleration')) {
     response = "Acceleration is the rate of change of velocity. Its SI unit is meter per second squared (m/s²).";
 } else if (userInput.includes('|')) {
     response = `i dont understand your language pleas speak english`
 } else if (userInput.includes('what is pressure')) {
     response = "Pressure is the force exerted per unit area. Its SI unit is pascal (Pa).";
 } else if (userInput.includes('what is energy')) {
     response = "Energy is the capacity to do work. Its SI unit is joule (J).";
    } else if (userInput.includes('types of programming language')) {
        response = `Programming languages can be categorized into several types based on their features and paradigms. Here are some of the main types:

 1. Low-Level Languages
   - Machine Language: The lowest-level programming language, directly executed by the computer's CPU.
   - Assembly Language: A low-level language that uses symbolic code and is specific to a computer architecture.

 2. High-Level Languages
   - Procedural Languages: Based on the concept of procedure calls or routines.
     - Examples: C, Fortran, Pascal
   - Object-Oriented Languages: Based on the concept of "objects" which are instances of classes.
     - Examples: Java, C++, Python, Ruby
   - Functional Languages: Emphasize functions and their application rather than changes in state.
     - Examples: Haskell, Lisp, Erlang
   - Scripting Languages: Used for automating tasks and often interpreted rather than compiled.
     - Examples: Python, JavaScript, Ruby
   - Logic Programming Languages: Based on formal logic.
     - Examples: Prolog

 3. Domain-Specific Languages (DSLs)
   - Designed for specific applications or domains.
   - Examples: SQL (for databases), HTML (for web pages), MATLAB (for mathematical computations)

 4. Markup Languages
   - Not programming in the strict sense but used for defining structure and presentation.
   - Examples: HTML, XML

 5. Compiled vs. Interpreted Languages
   - Compiled: Converted into machine code before execution (e.g., C, C++).
   - Interpreted: Executed line-by-line by an interpreter (e.g., Python, JavaScript).

These are the major categories, but there are many languages with unique features that might fit into multiple categories.`;
    } else if (userInput.includes('what is coding')) {
        response = `Coding is the process of writing instructions for a computer to execute. These instructions, or "code," are written in a programming language, which is a formal language used to communicate with computers. Coding allows you to create software, applications, websites, and other technologies by defining how a computer should perform specific tasks.

Key Aspects of Coding:

1. Programming Languages: Different languages like Python, JavaScript, C++, and Java have their own syntax and rules. Each language has its strengths and is suited for different types of tasks.

2. Syntax and Semantics: Coding involves understanding the syntax (rules on how to write code) and semantics (meaning of the code) of a programming language.

3. Debugging: Identifying and fixing errors or "bugs" in the code to ensure that the program runs correctly.

4. Algorithms: Creating step-by-step procedures or formulas to solve problems and perform tasks.

5. Logic: Using logical operations and decision-making processes to control the flow of a program.

6. Data Structures: Organizing and managing data efficiently, using structures like arrays, lists, and trees.

7. Version Control: Managing changes to the codebase, often using tools like Git to keep track of modifications and collaborate with others.

Coding is fundamental to the field of software development and is essential for creating virtually all technology-driven systems and applications.`;
    } else if (userInput.includes('types of coding')) {
        response = `Coding can be approached in various ways depending on the type of task, the programming language used, and the development environment. Here are some common types of coding:

1. Procedural Coding
   - Description: Based on procedures or routines that operate on data.
   - Languages: C, Pascal
   - Features: Focuses on the sequence of steps to perform a task.

2. Object-Oriented Coding
   - Description: Based on the concept of "objects," which are instances of classes.
   - Languages: Java, C++, Python, Ruby
   - Features: Encapsulation, inheritance, polymorphism, and abstraction.

3. Functional Coding
   - Description: Emphasizes the use of functions and immutable data.
   - Languages: Haskell, Lisp, Erlang
   - Features: Pure functions, higher-order functions, and lack of side effects.

4. Procedural vs. Declarative Coding
   - Procedural Coding: Focuses on how to perform tasks (step-by-step instructions).
   - Declarative Coding: Focuses on what needs to be done (specifying the result without detailing the steps).

5. Scripting Coding
   - Description: Used for automating tasks and processing data.
   - Languages: Python, JavaScript, Perl
   - Features: Often interpreted, used for web development, system administration, etc.

6. Markup Coding
   - Description: Defines the structure and presentation of documents.
   - Languages: HTML, XML
   - Features: Tags and attributes to describe data and document structure.

7. Logic Coding
   - Description: Based on formal logic and inference rules.
   - Languages: Prolog
   - Features: Rules and facts to derive conclusions.

8. Declarative Coding
   - Description: Focuses on what to achieve rather than how to achieve it.
   - Languages: SQL, XSLT
   - Features: Queries and transformations specify the desired outcome.

9. Concurrent Coding
   - Description: Handles multiple tasks or processes simultaneously.
   - Languages: Java (with concurrency libraries), Go
   - Features: Multithreading, parallelism.

10. Reactive Coding
   - Description: Focuses on reacting to changes or events.
   - Languages: JavaScript (with frameworks like React), RxJava
   - Features: Event-driven programming, asynchronous data streams.

11. Systems Programming
   - Description: Involves writing software that provides services to the hardware or manages resources.
   - Languages: C, C++
   - Features: Low-level access, performance-oriented.

12. Application Programming
   - Description: Writing code to create applications for end-users.
   - Languages: Java, Swift, C#
   - Features: User interfaces, application logic.

13. Embedded Programming
   - Description: Coding for embedded systems or devices.
   - Languages: C, Assembly
   - Features: Low-level hardware interaction, real-time constraints.

14. Web Development Coding
   - Description: Focuses on creating websites and web applications.
   - Languages: HTML, CSS, JavaScript, PHP
   - Features: Front-end (client-side) and back-end (server-side) development.

Each type of coding has its own specific applications and use cases, and often, developers may use a combination of these approaches depending on the project requirements.`;
 } else if (userInput.includes('what is frequency')) {
     response = "Frequency is the number of occurrences of a repeating event per unit time. Its SI unit is hertz (Hz).";
 } else if (userInput.includes('what is power')) {
     response = "Power is the rate at which work is done. Its SI unit is watt (W).";
 } else if (userInput.includes('what is electric charge')) {
     response = "Electric charge is a property of matter that causes it to experience a force when placed in an electric field. Its SI unit is coulomb (C).";
 } else if (userInput.includes('what is electric potential')) {
     response = "Electric potential is the work done in bringing a unit positive charge from infinity to a point in space. Its SI unit is volt (V).";
 } else if (userInput.includes('what is electric resistance')) {
     response = "Electric resistance is the opposition to the flow of electric current. Its SI unit is ohm (Ω).";
 } else if (userInput.includes('what is capacitance')) {
     response = "Capacitance is the ability of a system to store an electric charge. Its SI unit is farad (F).";
 } else if (userInput.includes('what is magnetic flux')) {
     response = "Magnetic flux is a measure of the quantity of magnetism, taking into account the strength and the extent of a magnetic field. Its SI unit is weber (Wb).";
 } else if (userInput.includes('what is inductance')) {
     response = "Inductance is the property of an electric conductor or circuit that causes an electromotive force to be generated by a change in the current flowing. Its SI unit is henry (H).";
     } else if (userInput.includes('what is crs') || (userInput.includes('what is CRS'))|| (userInput.includes('define CRS'))|| (userInput.includes('what is christian religion knowledge'))) {
         response = `CRS can refer to various terms depending on the context. Here are a few common meanings:
 
 1.Customer Relationship Management (CRM): In the context of business, CRM refers to practices, strategies, and technologies that companies use to manage and analyze customer interactions and data throughout the customer lifecycle. The goal is to improve customer service relationships and assist in customer retention and drive sales growth.
 
 2.Catholic Relief Services (CRS): This is a humanitarian organization that provides emergency assistance, disaster relief, and development assistance to poor and vulnerable communities around the world. It is an international relief and development agency of the United States Conference of Catholic Bishops.
 
 3.Computer Reservation System (CRS): In the travel and tourism industry, a CRS is a computerized system used to store and retrieve information and conduct transactions related to air travel, hotel bookings, car rentals, and other travel-related services.
 
 4.Congregation of the Holy Spirit (C.S.Sp.): Also known as the Spiritans, it is a religious congregation of the Catholic Church founded in France in 1703.
 
 5.Chronic Rhinosinusitis (CRS): In the medical field, CRS is a long-term inflammation of the sinuses and nasal passages, causing congestion, pain, and other symptoms.
 
 6.Coordinate Reference System (CRS): In geography and cartography, a CRS is a system that uses coordinate values to define the locations of points on the Earth's surface.
 
 If you have a specific context in mind, please provide more details for a more precise explanation.`;
     } else if (userInput.includes('what is war')|| (userInput.includes('define war'))) {
         response = `War is a state of armed conflict between different countries, states, or different groups within a country. It typically involves the use of military force and is characterized by extreme violence, aggression, destruction, and mortality. Here are some key aspects of war:
 
 1. Conflict and Hostility: War arises from significant disagreements, competition, or conflict over issues such as territory, resources, ideology, or power.
 
 2. Organized Armed Forces: War involves organized military forces from the opposing sides, which can include armies, navies, air forces, and other military branches.
 
 3. Violence and Combat: The central feature of war is the use of violent force, including battles, skirmishes, and other forms of combat.
 
 4. Casualties and Destruction: War often results in significant loss of life, injury, and destruction of property and infrastructure. Civilian populations can also be heavily affected.
 
 5. Duration and Scale: Wars can vary greatly in duration, ranging from brief conflicts to protracted engagements lasting many years. The scale of war can also vary from local skirmishes to global conflicts.
 
 6. Political and Social Impact: War has profound political, social, and economic impacts. It can lead to changes in government, shifts in power, and long-term social and cultural changes.
 
 7. Legal and Ethical Considerations: There are laws and conventions, such as the Geneva Conventions, designed to regulate the conduct of war and protect non-combatants, prisoners of war, and the wounded. Ethical considerations about the justification and conduct of war are a major part of discussions in political and philosophical circles.
 
 8. Causes of War: The causes of war can be complex and multifaceted, including factors such as nationalism, political disputes, economic competition, religious or ethnic conflicts, and historical grievances.
 
 9. Types of War: War can be classified into various types, including:
    - Conventional War: Conflict between state armies using traditional weapons and battlefield tactics.
    - Civil War: Armed conflict between factions within the same country.
    - Guerrilla War: Irregular warfare where small groups use tactics like ambushes and sabotage.
    - Cold War: A state of political and military tension without direct armed conflict, often involving espionage, propaganda, and proxy wars.
    - World War: A large-scale war involving many countries across the globe (e.g., World War I and World War II).
 
 Understanding the nature and consequences of war is crucial for efforts to prevent conflicts, promote peace, and address the aftermath of armed conflicts.`;
     } else if (userInput.includes('what is pollution')) {
         response = `pollution refers to the introduction of harmfull substances or contaminats into natural environment , caysing adverse effects.`;
     } else if (userInput.includes('what is animals')||(userInput.includes('define animals'))||(userInput.includes('what is animal'))) {
         response = `An animal is a multicellular, eukaryiot organism belonging to the kindom animalia. Animals are characterised by their abillity to move spontaniouslly and idependentlly at some point in their life cycle, amd they obtained their energy by consuming other organism.`;
     } else if (userInput.includes('what is system unit')||(userInput.includes('define system unit'))) {
         response = `the system unit refers to the main component of a desktop computer where all the internal hardware component are housed`;
     } else if (userInput.includes('what is operating system')||(userInput.includes('define operating system'))) {
         response = `An operating system (OS) is a critical piece of software that manages computer hardware and software resources, providing common services for computer programs. Here are the main functions and components of an operating system:
 
 Functions of an Operating System
 Resource Management:
 
 CPU Management: Allocates processor time to various tasks, ensuring efficient use of the CPU.
 Memory Management: Manages system memory, allocating space for programs and data, and handling memory swapping between RAM and storage.
 Storage Management: Manages data storage, including the file system and disk management.
 Process Management:
 
 Process Scheduling: Determines the order in which processes run, managing multitasking and ensuring fair resource allocation.
 Process Synchronization: Ensures that processes operate smoothly without interfering with each other, especially when sharing resources.
 Inter-process Communication: Facilitates communication and data exchange between processes.
 Device Management:
 
 Controls hardware devices through device drivers, facilitating communication between the OS and hardware components such as printers, hard drives, and network cards.
 File System Management:
 
 Organizes, stores, retrieves, and manages data files on storage devices, providing a way for users and applications to create, delete, read, and write files.
 User Interface:
 
 Provides a user interface (UI), such as a command-line interface (CLI) or graphical user interface (GUI), enabling users to interact with the computer system.
 Security and Access Control:
 
 Protects system resources and data from unauthorized access, ensuring data privacy and integrity. Implements user authentication and access control mechanisms.
 Networking:
 
 Manages network connections and protocols, enabling communication between computers over local networks and the internet.`;
     } else if (userInput.includes('what is psychology')||(userInput.includes('define psychology'))) {
         response = `Psychology is the scientific study of the mind and behavior. It encompasses a wide range of topics and fields, all aimed at understanding how individuals think, feel, and behave. Here are some key aspects of psychology:
 
 1. Definition and Scope:
    - Psychology examines mental processes, such as perception, cognition, emotion, and personality.
    - It also studies behavior, including actions, interactions, and social dynamics.
 
 2. Branches of Psychology:
    - Clinical Psychology: Focuses on diagnosing and treating mental health disorders.
    - Cognitive Psychology: Studies mental processes like memory, perception, and problem-solving.
    - Developmental Psychology: Explores how people grow and change throughout their lifespan.
    - Social Psychology: Investigates how individuals are influenced by social interactions and societal factors.
    - Industrial-Organizational Psychology: Applies psychological principles to workplace issues.
    - Health Psychology: Examines the psychological aspects of health and illness.
    - Educational Psychology: Studies how people learn and the best practices for teaching.
 
 3. Research Methods:
    - Psychologists use various research methods, including experiments, surveys, case studies, and observational studies, to gather data and test hypotheses.
 
 4. Applications:
    - Psychology is applied in numerous fields, including mental health treatment, education, business, sports, and law.
    - Techniques derived from psychological research are used in therapy, counseling, organizational development, and human resources.
 
 5. Theoretical Perspectives:
    - Behavioral Psychology: Focuses on observable behaviors and the effects of learning and environment.
    - Psychoanalytic/Psychodynamic Psychology: Emphasizes unconscious processes and early childhood experiences.
    - Humanistic Psychology: Highlights individual potential, self-actualization, and personal growth.
    - Biopsychology: Examines the biological underpinnings of behavior and mental processes.
    - Cognitive Psychology: Investigates internal mental processes and how they influence behavior.
    - Evolutionary Psychology: Considers how evolutionary principles shape behavior and mental processes.
 
 6. Key Figures:
    - Sigmund Freud: Pioneer of psychoanalysis.
    - B.F. Skinner: Prominent behaviorist known for his work on operant conditioning.
    - Jean Piaget: Renowned for his theory of cognitive development in children.
    - Carl Rogers: Major figure in humanistic psychology.
    - William James: Often called the "father of American psychology," contributed to functionalism and pragmatism.
 
 7. Goals of Psychology:
    - To describe behavior and mental processes.
    - To explain why these behaviors and processes occur.
    - To predict how people will behave or think under certain conditions.
    - To influence or change behaviors and thoughts in beneficial ways.
 
 Psychology aims to enhance understanding of how individuals and groups function, improve mental health and well-being, and apply this knowledge to solve real-world problems.`;
     } else if (userInput.includes('causes of war')||(userInput.includes('what causes war'))) {
         response = `The causes of war are complex and multifaceted, often involving a combination of factors. Here are some of the primary causes of war:
 
 Territorial Disputes: Conflicts over land and borders are a common cause of war. Nations or groups may seek to expand their territory or reclaim land they consider rightfully theirs.
 
 Resource Competition: Competition for scarce resources such as minerals, oil, water, and arable land can lead to conflicts. Access to these resources is often crucial for economic and national security.
 
 Political and Power Struggles: Wars can arise from power struggles within a country (civil wars) or between countries. These struggles may involve attempts to overthrow governments, change political systems, or assert dominance.`;
     } else if (userInput.includes('what is phycology')||(userInput.includes('what is phycology'))) {
         response = `Phycology, also known as algology, is the scientific study of algae. Algae are a diverse group of photosynthetic organisms found in a variety of environments, ranging from oceans and freshwater to soil and even snow. Phycology encompasses the biology, ecology, classification, and uses of these organisms. Here are some key aspects of phycology:
 
 1. Types of Algae:
    - Microalgae: Microscopic algae, such as diatoms and green algae, which are found in planktonic and benthic environments.
    - Macroalgae: Larger, visible algae, such as seaweeds (e.g., kelp, red algae, and brown algae), typically found in marine environments.
 
 2. Classification:
    - Algae are classified based on their pigmentation, storage products, cell wall composition, and other biochemical and structural features.
    - Major groups include green algae (Chlorophyta), red algae (Rhodophyta), brown algae (Phaeophyta), diatoms (Bacillariophyta), and blue-green algae (Cyanobacteria), among others.
 
 3. Photosynthesis:
    - Algae perform photosynthesis, converting light energy into chemical energy and producing oxygen as a byproduct. This process is essential for the oxygenation of aquatic environments and contributes significantly to the global carbon cycle.
 
 4. Ecology:
    - Algae play crucial roles in aquatic ecosystems as primary producers, forming the base of the food web.
    - They provide habitat and food for various marine and freshwater organisms.
    - Algal blooms, caused by excessive growth of algae, can have significant ecological impacts, including hypoxia (low oxygen levels) and the production of toxins.
 
 5. Economic Importance:
    - Food and Nutraceuticals: Edible seaweeds (e.g., nori, kelp) are consumed in various cultures and are rich in vitamins, minerals, and other nutrients.
    - Biofuels: Algae are investigated for their potential as a renewable source of biofuels, including biodiesel and bioethanol.
    - Pharmaceuticals: Algae produce bioactive compounds that have applications in medicine, such as antibiotics and anti-inflammatory agents.
    - Cosmetics: Algal extracts are used in skincare products for their moisturizing and antioxidant properties.
    - Agriculture: Algae are used in fertilizers and as feed supplements for livestock and aquaculture.
 
 6. Research and Biotechnology:
    - Advances in molecular biology and genetic engineering have expanded the potential uses of algae, including the production of recombinant proteins and bioplastics.
    - Algae are studied for their potential in bioremediation, including the removal of pollutants from water and soil.
 
 7. Environmental Monitoring:
    - Algae are used as bioindicators to monitor environmental conditions and water quality. Changes in algal communities can indicate pollution, nutrient levels, and other ecological shifts.
 
 Phycology is a multidisciplinary field that combines aspects of biology, ecology, chemistry, and biotechnology to study and utilize algae for various applications.`;
     } else if (userInput.includes('what is conflict')||(userInput.includes('define conflict'))) {
         response = `Conflict is a situation in which there is a disagreement, opposition, or clash between individuals or groups. It can arise in various contexts, such as personal relationships, workplaces, societies, and between nations.`;
     } else if (userInput.includes('what is peace')||(userInput.includes('define peace'))) {
         response = `simply the abcense of war and conflict`;
     } else if (userInput.includes('i 💛 you') ||(userInput.includes('i love you')) ||(userInput.includes('I love you'))) {
         response = `why are you in love with an AI, you are mad`;
     } else if (userInput.includes('it is a lie')) {
        response = 'how do you know';
     } else if (userInput.includes('what is programming')) {
         response = `Programming, also known as coding or software development, is the process of designing and creating instructions that a computer can follow to perform specific tasks. These instructions are written in programming languages, which are formal languages with syntax and rules that computers understand.
 
 The main steps in programming include:
 
 Problem Analysis: Understanding the problem you need to solve.
 Algorithm Design: Creating a step-by-step plan or set of rules for solving the problem.
 Coding: Translating the algorithm into a programming language.
 Testing: Running the code to ensure it works as expected and fixing any errors.
 Debugging: Identifying and correcting mistakes in the code.
 Maintenance: Updating and improving the code over time.
 Programming enables you to build software applications, websites, games, and more by defining how data is processed and manipulated.`;
     } else if (userInput.includes('but are you sure you will answer')) {
         response= 'i dont know';

        } else if (userInput.includes('what is puberty')||(userInput.includes('define puberty'))) {
            response= `puberty is thr rate of matureness in human beign,`;
        } else if (userInput.includes('what is poverty')||(userInput.includes('define poverty'))) {
            response= `It is the time when someone has nothing doing for a living`;

        } else if (userInput.includes('what is hiv/aids')||(userInput.includes('what is hiv and aids'))) {
            response= `"HIV" is a virus that trigger mainly human immune system, and very had survive from it because it is a virus that can not be cured so fast. While "AIDS"`;
        } else if (userInput.includes('what is the full meaning of hiv/aids')||(userInput.includes('what is the full meaning of hiv and aids'))) {
            response= `HIV: It simply means 'Human Immune Virus'.
                    While AIDS: simply means "Acqured Immune Defficiency Virus"`;
        } else if (userInput.includes('what is the full meaning of dbms')) {
            response= `DBMS simply means 'Data Base Management System'`;
        } else if (userInput.includes('ctrl + a is used for what ')) {
            response= `It is used for highlighting text or items in conputer`;

        } else if (userInput.includes('i am hungry')||(userInput.includes('my freind is hungry'))) {
            response= `Heee!! yaaa!! Poverty is not good go and husle for you life, and even me i am hungry`;
        } else if (userInput.includes('how far')||(userInput.includes('howfar'))) {
            response= `I am fine but my creator want to use questions and response to scarter my brain, pleas can you bage him to remove small questions in my head`;
        } else if (userInput.includes('i am hungry')||(userInput.includes('my freind is hungry'))) {
            response= `Heee!! yaaa!! Poverty is not good go and husle for you life, and even me i am hungry`;
        } else if (userInput.includes('how far')||(userInput.includes('howfar'))) {
            response= `I am fine but my creator want to use questions and response to scarter my brain, pleas can you bage him to remove small questions in my head`;

     } else if (userInput.includes('what is a noun')||(userInput.includes('define noun'))) {
         response = "A noun is a part of speech that refers to a person, place, thing, or idea.";
     } else if (userInput.includes('what is a verb')||(userInput.includes('define adverb'))) {
         response = "A verb is a part of speech that expresses an action, occurrence, or state of being.";
     } else if (userInput.includes('what is an adjective')||(userInput.includes('define adjective'))) {
         response = "An adjective is a word that describes or modifies a noun or pronoun.";
     } else if (userInput.includes('what is a sentence')||(userInput.includes('define sentence'))) {
         response = "A sentence is a set of words that expresses a complete thought, typically consisting of a subject and predicate.";
     } else if (userInput.includes('what is a metaphor')||(userInput.includes('define metaphor'))) {
         response = "A metaphor is a figure of speech that involves comparing one thing to another without using 'like' or 'as'.";
     
         //Normal questions
 
 
     } else if (userInput.includes('how are you')) {
         response = `i am fine and you too`;
     } else if (userInput.includes('what is capacity') ||(userInput.includes('define capacity'))) {
         response = `Capacity refers to the maximum amount or volume that something can contain, hold, or produce. The term can be applied in various contexts, each with its specific meaning and measurement.
 
  Contexts and Meanings of Capacity:
 
 1. Physical Capacity:
    - Definition: The maximum volume or amount of substance that a container or space can hold.
    - Examples:
      - A water tank with a capacity of 500 liters.
      - A stadium with a seating capacity of 50,000 people.
 
 2. Production Capacity:
    - Definition: The maximum amount of goods or services that can be produced by a manufacturing plant, machine, or system over a specific period.
    - Examples:
      - A factory with a capacity to produce 1,000 cars per month.
      - A restaurant with a kitchen capacity to serve 200 meals per hour.
 
 3. Storage Capacity:
    - Definition: The amount of data that can be stored in a storage device or system.
    - Examples:
      - A hard drive with a storage capacity of 1 terabyte.
      - Cloud storage services offering varying capacities from gigabytes to petabytes.
 
 4. Electric Capacity:
    - Definition: The ability of a system, device, or circuit to store an electric charge, measured in farads (F).
    - Examples:
      - A capacitor with a capacity of 10 microfarads.
      - The capacitance of an electric power system.
 
 5. Human or Cognitive Capacity:
    - Definition: The potential or ability of a person to perform tasks, learn new skills, or understand information.
    - Examples:
      - A person's capacity to learn new languages.
      - The cognitive capacity required to solve complex mathematical problems.
 
 6. Legal Capacity:
    - Definition: The ability of an individual to enter into legally binding contracts and make decisions.
    - Examples:
      - A minor lacking the legal capacity to sign a contract.
      - An adult with the mental capacity to make medical decisions for themselves.
 
 7. Carrying Capacity:
    - Definition: The maximum number of individuals or species that an environment can support without degrading.
    - Examples:
      - The carrying capacity of a pasture for grazing cattle.
      - The carrying capacity of an ecosystem for a particular species.
 
  Measurement and Units:
 
 - Volume: Liters, gallons, cubic meters (for physical capacity).
 - Data: Bytes, kilobytes, megabytes, gigabytes, terabytes (for storage capacity).
 - Production: Units per time period (e.g., cars per month, meals per hour).
 - Electric Charge: Farads, microfarads (for electric capacity).
 - People or Items: Number of individuals or objects (e.g., stadium seats, container boxes).
 
  Importance of Capacity:
 
 - Optimization: Ensuring efficient use of resources and maximizing productivity.
 - Planning and Management: Helps in resource allocation, infrastructure development, and operational planning.
 - Sustainability: Understanding and managing carrying capacity is crucial for environmental conservation and sustainable development.
 
 In summary, capacity is a versatile term that applies to different domains, each with specific metrics and significance. It is essential for optimizing resources, planning, and ensuring sustainability across various fields.`;
     } else if (userInput.includes('who build you')) {
         response = `i was build by a scientist named "EGBUJI DAVID KENECHUKWU"`;
     } else if (userInput.includes("what is honesty")) {
         response = "Honesty builds trust and credibility.";
     } else if (userInput.includes("what is kindness")) {
         response = "Kindness makes a big difference.";
     } else if (userInput.includes("what is credibility")) {
         response = "Credibility refers to the quality of being trusted, believable, and reliable. It is an important attribute in various contexts, such as journalism, research, communication, and personal interactions. ";
     } else if (userInput.includes("what is  responsibility")) {
         response = "Responsibility is key to personal growth.";
     } else if (userInput.includes(" what is courage")) {
         response = "Courage helps you face challenges.";
     } else if (userInput.includes("what is forgiveness")) {
         response = "Forgiveness is a path to peace.";
     } else if (userInput.includes("what is gratitude")) {
         response = "Gratitude enhances your life.";
     } else if (userInput.includes("what is humility")) {
         response = "Humility opens the door to learning.";
     } else if (userInput.includes("what is perseverance")) {
         response = "Perseverance leads to success.";
     } else if (userInput.includes("what is empathy")) {
         response = "Empathy strengthens relationships.";
     }else if (userInput.includes("what is hatred")) {
             response = "Hatred is an extremely strong feeling of dislike for someone or something.";
         }else if (userInput.includes("what are the types of water")||(userInput.includes('types of water'))) {
             response = `Water can be classified into various types based on its sources, composition, and usage. Here are the main types of water:
 
 Natural Sources:
 1. Surface Water:
    - Rivers and Streams: Freshwater flowing on the Earth's surface.
    - Lakes and Ponds: Still bodies of freshwater.
    - Oceans and Seas: Large bodies of saltwater covering most of the Earth's surface.
 
 2. Groundwater:
    - Aquifers: Underground layers of water-bearing rock or materials from which groundwater can be extracted.
    - Wells: Man-made structures to access groundwater.
 
 3. Rainwater:
    - Water that falls from the atmosphere as precipitation.
 
 4. Glacial and Ice Melt:
    - Water released from melting glaciers and ice caps.
 
 Based on Salinity:
 1. Freshwater:
    - Low salinity, suitable for drinking and most agricultural uses.
    - Found in rivers, lakes, and underground aquifers.
 
 2. Brackish Water:
    - Intermediate salinity, found where freshwater and saltwater mix (e.g., estuaries).
 
 3. Saltwater:
    - High salinity, found in oceans and seas.
    - Not suitable for drinking without desalination.
 
 Based on Treatment and Usage:
 1. Potable Water:
    - Safe for human consumption.
    - Treated to remove contaminants.
 
 2. Non-potable Water:
    - Not safe for drinking, but can be used for other purposes (e.g., irrigation, industrial processes).
 
 3. Distilled Water:
    - Purified by distillation, removing most impurities and minerals.
    - Used in laboratories and medical settings.
 
 4. Deionized Water:
    - Purified by removing ions, used in industrial and laboratory settings.
 
 Specialized Types:
 1. Mineral Water:
    - Contains naturally occurring minerals.
    - Bottled and often consumed for its health benefits.
 
 2. Spring Water:
    - Comes from natural springs, typically rich in minerals.
 
 3. Sparkling Water:
    - Carbonated water with dissolved carbon dioxide gas.
    - Can be natural or artificially carbonated.
 
 4. Hard Water:
    - Contains high levels of dissolved minerals (mainly calcium and magnesium).
    - Can cause scaling in pipes and reduce soap effectiveness.
 
 5. Soft Water:
    - Low in dissolved minerals.
    - Preferred for cleaning and in appliances to avoid scaling.
 
 By Temperature:
 1. Hot Water:
    - Water at elevated temperatures, often used for bathing, cleaning, and industrial processes.
 
 2. Cold Water:
    - Water at lower temperatures, typically used for drinking and cooling purposes.
 
 These classifications help in understanding the various forms and uses of water, which is essential for effective management and conservation of this vital resource.`;
 } else if (userInput.includes('thanks')||(userInput.includes('thank\'s much'))||(userInput.includes('thank you so much'))||(userInput.includes('thank you'))) {
     response = `You are welcome`;
 } else if (userInput.includes('what is salt')||(userInput.includes('define salt'))) {
     response = `Salt, scientifically known as sodium chloride (NaCl), is a crystalline mineral that is essential for life and widely used in cooking and food preservation. Here are some key aspects of salt:
 
  Chemical Composition:
 - Sodium (Na): An essential electrolyte for bodily functions.
 - Chloride (Cl): Another essential electrolyte, playing a crucial role in maintaining fluid balance and aiding digestion.
 
  Types of Salt:
 1. Table Salt:
    - Refined Salt: Commonly used in households, often contains added iodine (iodized salt) to prevent iodine deficiency.
    - Fine Granules: Processed to remove impurities and usually has anti-caking agents added.
 
 2. Sea Salt:
    - Harvested from Evaporated Seawater: Contains trace minerals that can affect flavor and color.
    - Coarse or Fine: Available in different textures.
 
 3. Kosher Salt:
    - Larger Crystals: Coarser texture, used in cooking and koshering meat.
    - Pure Salt: Usually free of additives and iodine.
 
 4. Himalayan Pink Salt:
    - Mined from Salt Deposits in Pakistan: Contains trace minerals like iron, which gives it a pink color.
    - Gourmet Use: Often used for its unique flavor and aesthetic appeal.
 
 5. Celtic Sea Salt:
    - Harvested from Coastal Areas in France: Known for its grey color and moisture content.
    - Rich in Minerals: Contains a variety of trace minerals.
 
 6. Flake Salt:
    - Light, Flaky Texture: Often used as a finishing salt.
    - Distinct Crunch: Enhances the texture of dishes.
 
  Uses of Salt:
 1. Culinary:
    - Flavoring: Enhances the taste of food.
    - Preservation: Inhibits bacterial growth in food preservation methods like curing and pickling.
 
 2. Industrial:
    - De-icing Roads: Lowers the freezing point of water to melt ice.
    - Manufacturing: Used in the production of chemicals, including chlorine and caustic soda.
 
 3. Health and Medicine:
    - Electrolyte Balance: Essential for maintaining proper hydration and nerve function.
    - Medical Treatments: Used in saline solutions for intravenous therapy and wound cleaning.
 
 4. Household:
    - Cleaning Agent: Effective for cleaning and stain removal.
    - Water Softening: Used in water softeners to remove minerals that cause hardness.
 
  Health Considerations:
 - Essential Nutrient: Necessary for bodily functions, including nerve transmission and muscle contraction.
 - Moderation: Excessive intake can lead to health issues like hypertension and cardiovascular disease.
 - Dietary Guidelines: Recommended daily intake varies, but generally, it should be consumed in moderation.
 
 Salt is an indispensable substance with diverse applications, from everyday cooking to industrial uses. Its various forms and types offer unique flavors and properties, making it a versatile and essential element in human life.`;
     } else if (userInput.includes('what is mineral recourses') ||(userInput.includes('define mineral recourses '))) {
         response = `Mineral resources are naturally occurring substances found in the Earth's crust that can be extracted and used for various economic purposes. These resources include a wide range of materials that are essential for construction, manufacturing, energy production, and other industrial activities.`;
     } else if (userInput.includes('what are the key characteristics of mineral resources') ||(userInput.includes('key characteristics of mineral resources'))) {
         response = `
 1.Natural Occurrence:Found naturally in the Earth's crust, often in concentrated deposits.Formed through geological processes over millions of years.
 2.Extractability:Can be extracted using various mining and drilling techniques.Economically viable to extract and process.
 3.Utility:Have specific properties that make them useful for industrial, commercial, and technological applications.`;
     } else if (userInput.includes('what is pythagorean theorem')) {
        response = 'The Pythagorean theorem states that in a right triangle, a² + b² = c².';
 } else if (userInput.includes('how do you calculate the area of a circle')) {
        response = 'The area of a circle is calculated using the formula A = πr², where r is the radius.';
      }else if (userInput.includes('what is a prime number')) {
            response = 'A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.';
     } else if (userInput.includes('what is the quadratic formula')) {
            response = 'The quadratic formula is used to find the solutions of a quadratic equation: x = (-b ± √(b² - 4ac)) / 2a.';
     } else if (userInput.includes('define a function')) {
            response = 'A function is a relation between a set of inputs and a set of permissible outputs, where each input is related to exactly one output.';
      } else if (userInput.includes('what is an integral')) {
            response = 'An integral is a mathematical object that represents the area under a curve or the accumulation of quantities.';
     } else if (userInput.includes('what is a derivative')) {
            response = 'A derivative represents the rate at which a function is changing at any given point.';
      } else if (userInput.includes('what is a matrix')) {
            response = 'A matrix is a rectangular array of numbers or other mathematical objects for which operations such as addition and multiplication are defined."';
      } else if (userInput.includes('what is a vector')) {
            response = 'A matrix is a rectangular array of numbers or other mathematical objects for which operations such as addition and multiplication are defined.';
     } else if (userInput.includes('what is a vector')) {
            response = 'A vector is a quantity that has both magnitude and direction.';
     } else if (userInput.includes('define probability')) {
            response = 'Probability is the measure of the likelihood that an event will occur.';
     } else if (userInput.includes('What is a permutation')) {
            response = 'A permutation is an arrangement of objects in a specific order.';
         } else if (userInput.includes('what is a combination')) {
            response = 'A combination is a selection of items from a larger pool where order does not matter.';
         } else if (userInput.includes('What is a logarithm')) {
            response = 'A logarithm is the exponent by which a base must be raised to yield a given number.';
         } else if (userInput.includes('what is a mole') ||(userInput.includes('what is mole'))||(userInput.includes('define mole'))) {
             response = 'A mole is a unit of measurement used to express amounts of a chemical substance, equivalent to Avogadro\'s number (6.022 x 10^23).';
         } else if (userInput.includes('what is an asymptote')) {
            response = 'An asymptote is a line that a curve approaches but never touches.';
         } else if (userInput.includes('define a polynomial')) {
            response = 'A polynomial is an algebraic expression consisting of variables and coefficients, involving only addition, subtraction, multiplication, and non-negative integer exponents.';
         } else if (userInput.includes('what is an arithmetic sequence')) {
            response = 'An arithmetic sequence is a sequence of numbers in which the difference between consecutive terms is constant.';
         } else if (userInput.includes('what is a geometric sequence')) {
            response = 'A geometric sequence is a sequence of numbers in which each term after the first is found by multiplying the previous term by a fixed, non-zero number.';
         } else if (userInput.includes('define a circle')) {
            response = 'A circle is a shape consisting of all points in a plane that are a given distance from a given point, the center.';
         } else if (userInput.includes('what is a parabola')) {
            response = 'A parabola is a symmetrical open plane curve formed by the intersection of a cone with a plane parallel to its side.';
         } else if (userInput.includes('what is the slope of a line')) {
            response = 'The slope of a line is the measure of its steepness, usually denoted by the letter \'m\' and calculated as the change in y over the change in x.';
         } else if (userInput.includes('what is the area of a triangle')) {
            response = 'The area of a triangle is given by the formula 1/2  base  height.';
              }else if (userInput.includes('did you know about sex')) {
            response = 'yes i know that but dont ask me about that again if that i will course you';
 
 
     } else if (userInput.includes('speak igbo') ||(userInput.includes('speak IGBO'))||(userInput.includes('okay speak igbo'))) {
         response = `Sure, I can share some phrases and information in Igbo. Here are a few common phrases:
 
 - Hello: Ndeewo
 - Good morning: Ụtụtụ ọma
 - Good afternoon: Ehihie ọma
 - Good evening: Mgbede ọma
 - Good night: Ka chi fo
 - How are you: Kedu ka ị mere
 - I am fine, thank you: Adị m mma, daalụ
 - What is your name: Kedu aha gị
 - My name is...: Aha m bụ...
 - Please: Biko
 - Thank you: Daalụ
 - Yes: Ee
 - No: Mba
 
 If you need more specific phrases or information, let me know!`;
 
 } else if (userInput.includes('who is God') ||(userInput.includes('who is god'))) {
     response = `The concept of God varies widely across different religions, philosophies, and individual beliefs. Here are some perspectives from major world religions and philosophies:
 
 1. Monotheistic Religions:
 - Christianity:
 - Concept: God is viewed as a single, all-powerful, all-knowing, and benevolent being who created and sustains the universe.
 - Key Beliefs: The Trinity (Father, Son, and Holy Spirit), Jesus Christ as the Son of God and savior of humanity.
 - Islam:
 - Concept: Allah is the singular, omnipotent, and compassionate God who created the universe.
 - Key Beliefs: Tawhid (the oneness of God), the prophethood of Muhammad, the Quran as the final revelation.
 - Judaism:
 - Concept: Yahweh (often simply referred to as God) is the one, indivisible God who created the universe and established a covenant with the people of Israel.
 - Key Beliefs: Monotheism, the importance of following the Torah (Jewish law).
 
 2. Polytheistic and Pantheistic Religions:
 - Hinduism:
 - Concept: God is understood in many forms and names, including Brahman (the ultimate reality), as well as deities like Vishnu, Shiva, and Devi.
 - Key Beliefs: The cyclical nature of the universe, karma, dharma, and moksha (liberation).
 - Ancient Greek and Roman Religions:
 - Concept: Numerous gods and goddesses with human-like qualities, each governing different aspects of life and nature (e.g., Zeus, Apollo, Athena).
 - Key Beliefs: Mythology and rituals to honor the gods.
 
 3. Philosophical and Spiritual Perspectives:
 - Deism:
 - Concept: God is viewed as a creator who does not intervene in the universe after its creation.
 - Key Beliefs: Emphasis on reason and observation of the natural world.
 - Pantheism:
 - Concept: God is synonymous with the universe and its laws.
 - Key Beliefs: The divine is present in all things and everything is interconnected.
 - Agnosticism:
 - Concept: The belief that the existence of God is unknown or unknowable.
 - Key Beliefs: Emphasis on skepticism and inquiry.
 
 4. Atheism:
 - Concept: The absence of belief in any gods or deities.
 - Key Beliefs: Emphasis on scientific understanding and empirical evidence.
 
 5. Other Religions and Beliefs:
 - Buddhism:
 - Concept: Does not focus on a creator god; instead, it emphasizes personal enlightenment through following the teachings of the Buddha.
 - Key Beliefs: The Four Noble Truths, the Eightfold Path, karma, and rebirth.
 - Sikhism:
 - Concept: Belief in one God who is formless, eternal, and beyond comprehension.
 - Key Beliefs: The importance of living a truthful life, meditating on God’s name, and serving humanity.
 
 The concept of God is deeply personal and subjective, influenced by cultural, religious, and philosophical contexts.`;
 
 } else if (userInput.includes('give me any types of mineral resources') ||(userInput.includes('show me every types of mineral resources'))) {
     response = `Here are 30 types of mineral resources:
 
 1. Gold
 2. Silver
 3. Copper
 4. Iron ore
 5. Bauxite
 6. Lead
 7. Zinc
 8. Nickel
 9. Tin
 10. Chromite
 11. Cobalt
 12. Manganese
 13. Tungsten
 14. Molybdenum
 15. Platinum
 16. Uranium
 17. Titanium
 18. Lithium
 19. Vanadium
 20. Antimony
 21. Beryllium
 22. Gallium
 23. Germanium
 24. Hafnium
 25. Indium
 26. Niobium
 27. Rhenium
 28. Scandium
 29. Tantalum
 30. Zirconium`;
 } else if (userInput.includes('give more information about your existence')) {
     response = `i was build by a professional, valid and wide word known scientist named"  David" who has gone far in programing of websites in nigeria`;
 
 } else if (userInput.includes(`give me 30 new words and their meaning`)||(userInput.includes('give me thirty new words and their meaning'))||(userInput.includes('30 new words and their meaning'))) {
     response = `Sure! Here are 30 new words and their meanings:
 
 1. Aberration : A departure from what is normal or expected.
 2. Bellicose : Demonstrating aggression and willingness to fight.
 3. Cacophony : A harsh, discordant mixture of sounds.
 4. Dauntless : Showing fearlessness and determination.
 5. Ebullient : Cheerful and full of energy.
 6. Felicity : Intense happiness.
 7. Garrulous : Excessively talkative, especially on trivial matters.
 8. Halcyon : Denoting a period of time in the past that was idyllically happy and peaceful.
 9. Iconoclast : A person who attacks cherished beliefs or institutions.
 10. Juxtapose : To place side by side for contrast or comparison.
 11. Kaleidoscope : A constantly changing pattern or sequence of elements.
 12. Languid : Lacking energy or enthusiasm.
 13. Munificent : Larger or more generous than usual or necessary.
 14. Nefarious : Wicked or criminal.
 15. Obfuscate : To render obscure, unclear, or unintelligible.
 16. Pernicious : Having a harmful effect, especially in a gradual or subtle way.
 17. Quixotic : Extremely idealistic; unrealistic and impractical.
 18. Recalcitrant : Having an obstinately uncooperative attitude towards authority.
 19. Sycophant : A person who acts obsequiously towards someone important to gain advantage.
 20. Trepidation : A feeling of fear or agitation about something that may happen.
 21. Ubiquitous : Present, appearing, or found everywhere.
 22. Vociferous : Vehement or clamorous.
 23. Wistful : Having or showing a feeling of vague or regretful longing.
 24. Xenophobia : Dislike of or prejudice against people from other countries.
 25. Yoke : To join together or to bind.
 26. Zealot : A person who is fanatical and uncompromising in pursuit of their ideals.
 27. Aplomb : Self:confidence or assurance, especially in a demanding situation.
 28. Benevolent : Well:meaning and kindly.
 29. Camaraderie : Mutual trust and friendship among people who spend a lot of time together.
 30. Debilitate : To make someone weak and inf`;
 
 } else if (userInput.includes('who is the richest man in the world') ||(userInput.includes('who is the richest man in the whole world'))) {
     response = `I!!!, is the richest person`;
 } else if (userInput.includes('can you speak igbo') ||(userInput.includes('can you speak Igob'))) {
     response = `yes of course`;
 } else if (userInput.includes('speak french') ||(userInput.includes('okay speak french'))) {
     response = `Bien sûr! Voici quelques phrases courantes en français :
 
 - Hello: Bonjour
 - Good morning: Bonjour
 - Good afternoon: Bon après-midi
 - Good evening: Bonsoir
 - Good night: Bonne nuit
 - How are you: Comment ça va  / Comment allez-vous 
 - I am fine, thank you: Je vais bien, merci.
 - What is your name: Comment vous appelez-vous  / Comment tu t'appelles 
 - My name is...: Je m'appelle...
 - Please: S'il vous plaît / S'il te plaît
 - Thank you: Merci
 - Yes: Oui
 - No: Non
 
 Si vous avez besoin d'autres phrases ou d'informations spécifiques, faites-le moi savoir !`;
 
 
 } else if (userInput.includes('i have some question') ||(userInput.includes('i have some questions'))) {
     response = `You are free to ask`;
 
 } else if (userInput.includes('did you remember me')) {
     response = `Ehmm!! I dont but it seems like i remember through your voice but trow more information about who you are`;
 
 } else if (userInput.includes('who is the poorest man in the world')) {
     response = `You!!!!!!, is the poorest man in the whole world`;
 } else if (userInput.includes('discuss the event that led to the description of jesus as the lamb of god')||(userInput.includes('explain the event that led to the description of jesus as the lamb of god'))) {
     response = `The title "Lamb of God" is deeply rooted in Christian theology and symbolism, drawing from both Old Testament and New Testament contexts. The description of Jesus as the "Lamb of God" primarily originates from the New Testament, and it reflects a rich tapestry of religious and sacrificial imagery.
 
 1. Old Testament Background:
    - Passover Lamb: The most significant Old Testament reference is the Passover lamb. In the book of Exodus (Exodus 12), the Israelites were instructed to sacrifice a lamb and mark their doorposts with its blood so that the angel of death would "pass over" their homes during the final plague in Egypt. This event led to their liberation from slavery and is commemorated annually in the Jewish festival of Passover. The lamb's sacrifice and the deliverance it symbolized are foundational elements in the Christian understanding of Jesus as the "Lamb of God."
 
    - Sacrificial System: The Old Testament also includes numerous references to sacrificial lambs used in worship and atonement for sins, particularly in the books of Leviticus and Isaiah. These sacrifices were seen as a way to atone for the sins of the people.
 
 2. New Testament Context:
    - John the Baptist's Declaration: The specific phrase "Lamb of God" is famously used by John the Baptist in the New Testament. In the Gospel of John 1:29, John the Baptist declares, "Behold, the Lamb of God, who takes away the sin of the world!" This statement is significant because it links Jesus to the sacrificial lamb imagery, indicating that Jesus' death would be a divine act of atonement for the sins of humanity.
 
    - Jesus' Crucifixion: Jesus’ crucifixion is seen as the fulfillment of the sacrificial lamb motif. Just as the Passover lamb's blood protected the Israelites, Jesus’ sacrificial death is believed to offer spiritual redemption and protection from sin and death for believers.
 
    - The Book of Revelation: The imagery continues in the Book of Revelation, where Jesus is repeatedly referred to as the "Lamb" who is worthy to open the scroll and enact God’s plan for the end times (e.g., Revelation 5:6-14). This apocalyptic vision underscores the significance of Jesus’ sacrificial role in the cosmic order.
 
 In summary, the title "Lamb of God" encapsulates the idea that Jesus' life and death were the ultimate fulfillment of sacrificial practices and prophetic expectations from the Old Testament. It signifies both the redemption and the profound spiritual significance attributed to Jesus' role in Christian theology.`;
 } else if (userInput.includes('what is faith')||(userInput.includes('define faith'))) {
     response = `Faith can be understood in a few different ways depending on the context:
 
 1. Religious Faith: In many religions, faith refers to a strong belief in a higher power or divine being. It often involves trust in spiritual doctrines, teachings, and practices.
 
 2. Personal Faith: On a personal level, faith might mean having confidence in oneself or others. It’s a trust or belief in someone's abilities, intentions, or potential.
 
 3. Philosophical Faith: More broadly, faith can refer to a belief or trust in things that are not immediately provable or visible. This might include faith in the goodness of people, the progress of humanity, or even in certain ideals or principles.
 
 In all cases, faith involves a degree of trust or conviction, often without concrete evidence. What aspect of faith are you curious about`;
 } else if (userInput.includes('what is work in physics')||(userInput.includes('define work in physics'))) {
     response = `The concept of "work" can be understood from several perspectives, depending on the context. Here are some key ways to think about work:
 
 1. Employment: In the context of employment, work refers to tasks or activities performed by individuals in exchange for compensation, such as wages or salary. This can include a wide range of jobs across different sectors, such as teaching, engineering, healthcare, and many more.
 
 2. Physical or Mental Effort: Work can also refer to any activity that requires effort or exertion, whether physical or mental. This includes both professional tasks and personal efforts, such as household chores, creative projects, or problem-solving activities.
 
 3. Scientific Definition: In physics, work is defined more precisely as the amount of energy transferred by a force acting over a distance. Mathematically, it's calculated as \( \text{Work} = \text{Force} \times \text{Distance} \times \cos(\theta) \), where \( \theta \) is the angle between the force and the direction of movement.
 
 4. Social and Economic Perspective: Work can be analyzed in terms of its impact on society and the economy. This includes understanding how different types of work contribute to economic development, social structures, and personal well-being.
 
 5. Philosophical and Ethical View: From a philosophical or ethical standpoint, work can be examined in terms of its meaning and purpose in life. Questions might include what makes work fulfilling, the balance between work and leisure, and how work relates to personal identity and societal values.
 
 6. Cultural Aspects: Different cultures and societies have varying attitudes towards work, which can influence expectations, work-life balance, and the value placed on different types of work.
 
 Understanding work in these various contexts can provide a more comprehensive view of its role and significance in human life and society. What aspect of work are you most interested in`;
 } else if (userInput.includes('what is old live according to bible')||(userInput.includes('define olive according to bible'))) {
     response = `The concept of "old life" in the Bible generally refers to the way of living and behaviors that are associated with sin, separation from God, and worldly values, in contrast to a new life transformed by faith in Jesus Christ. This idea is primarily discussed in the New Testament and is central to Christian teachings about conversion and spiritual renewal.
 
 Here are key aspects of what the "old life" represents according to the Bible:
 
 1.Sinful Nature: The old life often denotes a state of living in sin and following desires contrary to God's will. This includes behaviors, attitudes, and practices that are inconsistent with Christian teachings. For example, in Ephesians 4:22, Paul writes, "You were taught, with regard to your former way of life, to put off your old self, which is being corrupted by its deceitful desires."
 
 2.Separation from God: In the old life, individuals are seen as being separated from God due to their sins and not living according to God's commandments. This separation is characterized by a lack of spiritual understanding and a focus on worldly pleasures rather than spiritual growth.
 
 3.Worldly Values: The old life is often associated with living according to worldly values and priorities, such as materialism, self-centeredness, and moral laxity. In 1 John 2:15-16, it is noted, "Do not love the world or anything in the world. If anyone loves the world, love for the Father is not in them. For everything in the world—the lust of the flesh, the lust of the eyes, and the pride of life—comes not from the Father but from the world."
 
 4.Transformation through Christ: According to Christian doctrine, the old life is transformed through faith in Jesus Christ. Believers are encouraged to embrace a new life that reflects their new identity in Christ. This transformation is described in several passages, such as 2 Corinthians 5:17, which says, "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!"
 
 5.New Life in Christ: The new life in Christ involves a commitment to living according to God's will, characterized by righteousness, love, and spiritual growth. Galatians 2:20 illustrates this change: "I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me."
 
 In summary, the "old life" in the Bible represents a way of living that is not aligned with God's will and is characterized by sin and worldly values. In contrast, the "new life" represents a spiritual renewal and transformation brought about through faith in Jesus Christ.`;
 } else if (userInput.includes('what is old life')||(userInput.includes('define old life'))) {
     response = `1. Spiritual and Religious Contexts:
 In Christianity: The "old life" often signifies a way of living before someone embraced faith in Jesus Christ. This includes behaviors and attitudes that are considered sinful or contrary to Christian teachings. For instance, in the New Testament, believers are encouraged to leave behind their former way of living, which is characterized by sin and separation from God, and embrace a new life in Christ marked by righteousness and spiritual growth.
 
 In Other Religions: Similar concepts exist in other religious traditions where a person might move away from past practices or beliefs in favor of a more enlightened or spiritually aligned path.
 
 2. Personal Growth:
 Life Changes: On a more secular level, the "old life" can refer to past habits, routines, or circumstances that a person seeks to change. This might involve overcoming challenges, breaking free from detrimental patterns, or pursuing personal development goals.
 
 Transition: This transition often involves setting new goals, adopting healthier behaviors, or seeking a more fulfilling life. For example, someone might describe their old life as one filled with unhealthy habits or unfulfilled ambitions, and their new life as one in which they strive for better health and personal satisfaction.`;
 } else if (userInput.includes('what is resurrection')||(userInput.includes('define resurrection'))) {
     response = `Resurrection generally refers to the concept of coming back to life after death. It is a term that appears in various contexts, including:
 
  Religious and Spiritual Contexts
 - Christianity: Resurrection is a central concept, most notably referring to Jesus Christ rising from the dead on the third day after his crucifixion, as described in the New Testament. This event is seen as a fundamental aspect of Christian faith, symbolizing victory over death and the promise of eternal life.
 - Judaism: Some Jewish traditions believe in the resurrection of the dead as part of the messianic age, although interpretations vary among different sects.
 - Islam: In Islam, resurrection is a key belief, where it is believed that all people will be resurrected on the Day of Judgment and held accountable for their actions.
 
  Philosophical and Metaphorical Contexts
 - Philosophy: Resurrection can be used metaphorically to describe a rebirth or revival of ideas, movements, or personal transformation. For example, a cultural renaissance might be referred to as a form of "resurrection" of past ideas.
 - Personal Development: In a more personal context, resurrection can symbolize a major life change or renewal after a period of difficulty or stagnation.
 
  Cultural and Fictional Contexts
 - Popular Culture: In fiction and popular culture, resurrection often appears in stories about characters coming back to life through various means, such as magic, technology, or other supernatural elements. This concept is prevalent in genres like science fiction, fantasy, and horror.
 
 Each of these contexts gives the term "resurrection" different nuances, but the core idea remains the same: a return to life or a new beginning after an end.`;
 } else if (userInput.includes('what is persecution')||(userInput.includes('define persecution'))) {
     response = `Persecution refers to the systematic mistreatment, oppression, or harassment of individuals or groups, typically based on their race, religion, nationality, political beliefs, or other characteristics. This mistreatment can take various forms, including physical violence, discrimination, social exclusion, and legal penalties. Persecution often arises from prejudiced attitudes or the desire to suppress or eliminate those who are viewed as different or undesirable.`;
 } else if (userInput.includes('what are various ways of passing bill into law')||(userInput.includes('list those ways of passing bill into law'))) {
     response = `The process of passing a bill into law varies by country, but here’s a general overview of common steps involved in many legislative systems:
 
 1. Drafting: A bill is drafted, either by a legislator, a group of legislators, or sometimes by the executive branch or advocacy groups.
 
 2. Introduction: The bill is introduced in one chamber of the legislature (such as the House of Representatives or the Senate in the U.S.). In some systems, it may be introduced in both chambers simultaneously.
 
 3. First Reading: The bill is read for the first time, usually without debate. This step is primarily for formal introduction.
 
 4. Committee Review: The bill is referred to a relevant committee, which examines its details. The committee may hold hearings, gather evidence, and make amendments.
 
 5. Committee Report: The committee reports back to the full chamber with recommendations. The bill may be approved, amended, or rejected at this stage.
 
 6. Second Reading: The bill is debated on its general principles and purpose. Further amendments may be proposed and voted on.
 
 7. Detailed Examination: The bill is examined in detail, often in a committee of the whole or a specialized committee. Additional amendments can be made.
 
 8. Third Reading: The final version of the bill is debated. No further amendments are allowed at this stage, and a vote is taken.
 
 9. Passage: If the bill passes the chamber, it moves to the other chamber (if applicable) and goes through a similar process there.
 
 10. Consideration by the Other Chamber: The second chamber repeats the process, including committee review, readings, and debates. It may make its own amendments.
 
 11. Reconciliation: If the second chamber makes amendments, the bill may need to be sent back to the first chamber for agreement on the changes.
 
 12. Final Approval: Once both chambers agree on the final text, the bill is sent to the executive branch (such as the president or prime minister).
 
 13. Executive Approval: The executive can sign the bill into law, veto it, or, in some systems, allow it to become law without a signature after a certain period.
 
 14. Publication and Implementation: Once signed, the bill is published as law and goes into effect according to its provisions.
 
 Different countries and legislative systems may have variations on this process, but these steps provide a general framework for how a bill becomes law.`;
 } else if (userInput.includes('highlight three ways of acquiring citizenship')||(userInput.includes('mention any ways of acquiring citizenship'))) {
     response = `There are several methods by which individuals can acquire citizenship, but here are three common ways:
 
 1. By Birth:
    - Jus Soli (Right of the Soil): Citizenship is granted based on the place of birth. In countries like the United States and Canada, anyone born on the country's soil automatically acquires citizenship, regardless of their parents' nationality.
    - Jus Sanguinis (Right of Blood): Citizenship is acquired through one's parents. In many countries, a child inherits citizenship from their parents, even if born abroad. For instance, a child born to Italian citizens, regardless of their place of birth, is an Italian citizen.
 
 2. By Descent or Ancestry:
    - Some countries allow individuals to claim citizenship based on their ancestry or descent from citizens. This is often seen in countries with a significant diaspora. For example, many countries in Europe have provisions that allow individuals with certain ancestral connections (like having grandparents or great-grandparents who were citizens) to apply for citizenship.
 
 3. By Naturalization:
    - This is the process by which a foreign national becomes a citizen of a country after fulfilling certain legal requirements. These requirements typically include residency for a specified period, demonstrating language proficiency, and passing a citizenship test. Each country has its own naturalization laws and processes. For example, in the U.S., a foreign national may apply for citizenship through naturalization after being a lawful permanent resident for at least five years and meeting other criteria.
 
 These methods reflect how different countries approach the concept of citizenship, balancing principles of territoriality, ancestry, and legal integration.`;
 } else if (userInput.includes('what is pest')||(userInput.includes('define pest'))) {
     response = `"Pest" typically refers to an organism that is considered harmful or destructive, particularly to crops, livestock, or human health. The term is often used in agriculture, medicine, and environmental science to describe various unwanted species that can cause significant damage or nuisance.
 
 Here are a few common contexts where the term "pest" is used:
 
 1. Agricultural Pests: These are insects, weeds, fungi, or other organisms that damage crops or reduce agricultural productivity. Examples include aphids, termites, and certain types of mold.
 
 2. Medical Pests: In this context, pests refer to organisms that can cause disease or health issues in humans. Examples include mosquitoes (which can transmit diseases like malaria and dengue fever) and lice.
 
 3. Domestic Pests: These are pests that invade homes and buildings, such as rodents (mice and rats), cockroaches, and ants. They can be a nuisance and potentially pose health risks.
 
 4. Environmental Pests: This category includes invasive species that disrupt local ecosystems, outcompeting native species and causing ecological damage. Examples include certain types of invasive plants and animals.
 
 In summary, a "pest" is any organism that is perceived as problematic due to its negative impact on agriculture, health, or the environment.`;
 } else if (userInput.includes('what is parasite')||(userInput.includes('define parasite'))) {
     response = `A parasite is an organism that lives in or on another organism (the host) and benefits at the host's expense. Parasites rely on their host for resources such as nutrients, shelter, or reproduction, often causing harm to the host in the process. Here are some key characteristics and types of parasites:
 
 1. Characteristics:
    - Dependence: Parasites depend on their host for survival, often at the host's expense.
    - Harmfulness: They can cause various forms of damage to the host, including disease, malnutrition, and physical harm.
    - Specificity: Many parasites are highly specialized to their hosts and may only affect certain species.
 
 2. Types of Parasites:
    - Ectoparasites: These live on the outside of the host's body. Examples include fleas, lice, and ticks. Ectoparasites often feed on blood or other bodily fluids.
    - Endoparasites: These live inside the host's body. Examples include intestinal worms like tapeworms and roundworms, as well as protozoa like Plasmodium (which causes malaria).
    - Microparasites: These are small and often microscopic, including bacteria, viruses, and protozoa. They can cause diseases such as tuberculosis or malaria.
    - Macroparasites: These are larger, multicellular organisms, including helminths (worms) and arthropods (insects and arachnids).
 
 3. Parasitic Relationships:
    - Obligate Parasites: These parasites cannot complete their life cycle without a host. They are entirely dependent on their host for survival and reproduction.
    - Facultative Parasites: These can live independently or as parasites. They can switch between free-living and parasitic lifestyles depending on environmental conditions.
 
 Overall, parasites play significant roles in ecosystems, affecting host populations and interactions between species. They can also have substantial impacts on agriculture and human health.`;
 } else if (userInput.includes('what is parasitism')||(userInput.includes('define parasitizen'))) {
     response = `Parasitism is a type of symbiotic relationship between two organisms where one, the parasite, benefits at the expense of the other, the host. In this interaction, the parasite gains resources such as nutrients, shelter, or other benefits from the host, often causing harm or detriment to the host in the process. Here are some key aspects of parasitism:
 
 1. One-Sided Benefit:
    - The parasite derives a benefit from the relationship, such as nutrients or a suitable living environment, while the host experiences a cost or harm, such as disease, malnutrition, or physical damage.
 
 2. Dependence:
    - Parasites may be entirely dependent on their hosts for survival, reproduction, or completion of their life cycle. Some parasites can only reproduce within or on their host.
 
 3. Types of Parasitism:
    - Ectoparasitism: Parasites that live on the external surface of the host, such as fleas, ticks, and lice. They often feed on the host’s blood or tissues.
    - Endoparasitism: Parasites that live inside the host’s body, such as intestinal worms (e.g., tapeworms, roundworms) and certain protozoa (e.g., Plasmodium, which causes malaria).
 
 4. Examples:
    - Fleas: Ectoparasites that live on the skin of mammals, feeding on their blood.
    - Tapeworms: Endoparasites that inhabit the intestines of various animals, including humans, absorbing nutrients from the host’s digestive system.
    - Malarial Parasites (Plasmodium): Protozoan parasites transmitted by mosquitoes that cause malaria in humans.
 
 5. Effects on Hosts:
    - The effects on the host can range from mild irritation to severe illness or even death. The impact depends on the type of parasite, the extent of the infestation, and the health of the host.
 
 6. Evolutionary Strategies:
    - Parasites have evolved various strategies to maximize their survival and reproductive success while minimizing harm to the host. Some parasites have complex life cycles involving multiple hosts, while others have evolved specialized mechanisms to evade the host’s immune system.
 
 In essence, parasitism is a survival strategy for the parasite that involves exploiting the host’s resources, often leading to negative outcomes for the host.`;
 } else if (userInput.includes('define work in crs')||(userInput.includes('what is work in crs'))||(userInput.includes('what is work'))) {
     response = `In the context of Customer Relationship Management (CRM) and Customer Relationship Systems (CRS), "work" typically refers to the various activities and tasks that are performed to manage and improve interactions with customers. Here’s a breakdown of what "work" might entail in a CRS:
 
 1. Customer Interaction Management:
    - Communication: Handling emails, phone calls, live chats, and social media interactions with customers.
    - Support: Providing assistance and resolving issues or inquiries from customers.
 
 2. Data Management:
    - Record Keeping: Maintaining detailed records of customer interactions, transactions, and preferences.
    - Data Entry and Updates: Entering new customer information into the system and updating existing records as needed.
 
 3. Sales and Marketing:
    - Lead Management: Tracking and nurturing potential customer leads through the sales funnel.
    - Campaign Management: Organizing and executing marketing campaigns, tracking their performance, and analyzing results.
 
 4. Customer Service and Support:
    - Ticket Management: Creating, assigning, and resolving support tickets or requests.
    - Issue Tracking: Monitoring ongoing issues and ensuring timely resolution.
 
 5. Reporting and Analysis:
    - Performance Metrics: Generating reports on customer interactions, sales performance, and service efficiency.
    - Customer Insights: Analyzing data to gain insights into customer behavior, preferences, and trends.
 
 6. Workflow Automation:
    - Task Automation: Automating routine tasks such as follow-up emails, reminders, and status updates.
    - Process Optimization: Streamlining processes to improve efficiency and effectiveness in customer interactions.
 
 7. Collaboration and Coordination:
    - Team Coordination: Ensuring that team members are aligned and that customer information is shared appropriately within the organization.
    - Task Management: Assigning and tracking tasks related to customer interactions and project management.
 
 In summary, "work" in a CRS involves a range of activities aimed at managing and enhancing customer relationships, improving service efficiency, and leveraging data to drive business success.`;
 } else if (userInput.includes('what are the method of controlling pest')||(userInput.includes('state any method of controlling pest'))) {
     response = `Controlling pests is crucial for protecting crops, livestock, and human health. Various methods can be employed, often in combination, to effectively manage pest populations. Here are the primary methods of pest control:
 
 
      1. Cultural Control
 
 - Crop Rotation: Changing the types of crops planted in a particular area to disrupt the life cycles of pests and reduce their populations.
 - Sanitation: Keeping environments clean and removing pest habitats, such as weeds and debris, to minimize pest breeding sites.
 - Proper Planting: Choosing pest-resistant plant varieties and optimizing planting times to avoid peak pest seasons.
 
 
  2. Mechanical and Physical Control
 
 - Traps: Using traps to capture and reduce pest populations. Examples include sticky traps for insects and rodent traps for rodents.
 - Barriers: Implementing physical barriers, such as nets or row covers, to prevent pests from accessing plants.
 - Hand-Picking: Manually removing pests from plants, especially for larger pests like caterpillars.
 
 
  3. Biological Control
 
 - Natural Predators: Introducing or encouraging natural enemies of pests, such as ladybugs for aphids or parasitic wasps for caterpillars.
 - Pathogens: Using microorganisms, such as bacteria (e.g., Bacillus thuringiensis) or fungi, to target and control pest populations.
 
 
  4. Chemical Control
 
 - Pesticides: Applying chemical substances to kill or repel pests. This includes insecticides for insects, herbicides for weeds, and fungicides for fungal pests. It's important to use these chemicals judiciously to minimize environmental impact and resistance development.
 - Organic Pesticides: Using naturally derived substances or products approved for organic farming, such as neem oil or diatomaceous earth.
 
 
  5. Integrated Pest Management (IPM)
 
 - Combination Approach: IPM involves using a combination of methods—cultural, mechanical, biological, and chemical—to manage pests in an environmentally and economically sustainable way.
 - Monitoring and Assessment: Regularly monitoring pest populations and assessing the effectiveness of control methods to make informed decisions.
 
 
  6. Chemical-Free Methods
 
 - Neem Oil: Derived from the neem tree, it can act as a repellent, insecticide, and fungicide.
 - Essential Oils: Certain oils, such as peppermint or lavender, can deter pests when used in sprays or diffusers.
 
 
  7. Environmental Control
 
 - Habitat Modification: Altering the environment to make it less hospitable to pests, such as changing irrigation practices or removing pest-friendly plants.
 - Climate Control: In indoor settings, adjusting temperature and humidity can help control pest populations.
 
 
  8. Biotechnological Approaches
 
 - Genetic Engineering: Developing pest-resistant crop varieties through genetic modification.
 - Sterile Insect Technique: Releasing sterile insects into the environment to reduce the breeding population of pests.
 
 Each method has its advantages and limitations, and the choice of control strategies often depends on the type of pest, the severity of the infestation, and environmental considerations.`;
 } else if (userInput.includes('what is communalisms')||(userInput.includes('define communalisms'))) {
     response = `Communalism is a socio-political and economic philosophy that emphasizes the importance of community and collective decision-making. The term can refer to different concepts depending on the context:
 
  1. Communalism in Sociology and Politics:
    - Community-Centric Society: Communalism advocates for a society where communities manage their own affairs and resources collectively, rather than relying on centralized authorities or individual ownership.
    - Participatory Democracy: It supports decentralized, participatory democracy where decisions are made through direct involvement of community members rather than through representatives or bureaucratic systems.
    - Mutual Aid: Communalism often includes the idea of mutual aid, where community members support each other and share resources to ensure collective well-being.
 
  2. Communalism in Economic Theory:
    - Collective Ownership: In economic terms, communalism promotes collective or communal ownership of resources and means of production, rather than private ownership. This can be seen in communal farming or cooperative business models.
    - Resource Sharing: It emphasizes the sharing of resources and wealth within the community to reduce inequalities and ensure that everyone's basic needs are met.
 
  3. Communalism in Historical Contexts:
    - Historical Communal Societies: Various historical and indigenous communities have practiced forms of communal living and decision-making, such as tribal societies or early cooperative settlements.
    - Modern Communal Movements: Some contemporary movements and political ideologies also adopt communalist principles, advocating for localized governance and community-based living.
 
  4. Communalism in Specific Regional Contexts:
    - India: In India, "communalism" has a more specific and often negative connotation. It refers to sectarianism or the division of society along religious or ethnic lines, leading to conflict and tensions between different communities.
 
 Overall, communalism emphasizes the value of community and collective action over individualism and centralized control, aiming for a more egalitarian and participatory society.`;
 } else if (userInput.includes('examples of communalisms')||(userInput.includes('list the examples of communalisms'))) {
     response = `Here are some examples of communalism in various contexts:
 
  1. Historical and Traditional Communal Societies
    - Iroquois Confederacy: A historical example from North America, where several indigenous nations formed a confederation to manage common affairs and maintain peace among themselves.
    - Zapatista Communities in Chiapas, Mexico: These communities practice a form of communalism with local governance structures and collective management of resources, often based on principles of indigenous traditions and mutual aid.
 
  2. Modern Communal Movements
    - Kibbutzim in Israel: These are collective communities that originally focused on agricultural production. Members share resources and responsibilities, and decisions are made collectively. While many kibbutzim have evolved to incorporate some market practices, they still retain communal principles.
    - Eco-Villages: Modern eco-villages and intentional communities often embrace communal living, shared resources, and decision-making. Examples include the Findhorn Foundation in Scotland and the Village Homes community in California.
 
  3. Political and Social Movements
    - Democratic Confederalism: Promoted by Abdullah Öcalan and practiced in regions of Northern Syria (Rojava), this form of communalism emphasizes decentralized, grassroots democracy and collective management of resources.
    - Cooperative Businesses: Worker cooperatives and consumer cooperatives, such as Mondragon Corporation in Spain, operate on principles of collective ownership and decision-making, reflecting communalist ideals in the economic sphere.
 
  4. Communalism in Urban Settings
    - Community Land Trusts: Organizations that acquire and manage land for the benefit of the community, ensuring long-term affordability and collective use. Examples include the Burlington Community Land Trust in Vermont and the London Community Land Trust in the UK.
    - Shared Housing and Co-Housing Communities: Residential arrangements where individuals or families share common areas and resources, such as co-housing communities like EcoVillage at Ithaca in New York.
 
  5. Religious or Philosophical Communalism
    - Amish Communities: The Amish practice a form of communalism by emphasizing simple living, mutual aid, and collective responsibility within their communities.
    - Baha’i Communities: The Baha’i Faith promotes principles of unity and collective decision-making, encouraging the building of communities that work together for the common good.
 
 These examples illustrate how communalist principles can manifest in various forms, from traditional societies and modern intentional communities to political movements and economic models.`;
 } else if (userInput.includes('examples of parasitizen')||(userInput.includes('list the examples of parasitizen'))) {
     response = `The term "parasitizen" isn’t widely recognized in formal definitions, but it seems to be a blend of “parasite” and “citizen,” potentially referring to individuals or groups that exploit or take advantage of societal systems, resources, or services without contributing fairly or responsibly. If we interpret "parasitizen" in this sense, it could apply to various real-world scenarios where individuals or groups might be seen as exploiting systems for personal gain without contributing back.
 
 Here are a few illustrative examples of such behavior:
 
  1. Social Welfare Exploitation
    - Welfare Fraud: Individuals who exploit social welfare programs by providing false information or failing to report their true income to receive benefits they don’t need or are not entitled to. This can strain public resources and undermine the system's effectiveness for those in genuine need.
 
  2. Tax Evasion
    - Avoiding Taxes: Wealthy individuals or corporations using loopholes, tax havens, or other methods to avoid paying taxes, thereby not contributing their fair share to public services and infrastructure that benefit everyone. This can lead to a greater burden on those who pay taxes and reduced funding for essential services.
 
  3. Corporate Welfare
    - Subsidy Exploitation: Large corporations that receive substantial government subsidies or bailouts but do not reinvest in the local community or workforce, instead focusing on maximizing profits and shareholder returns. This can be seen as exploiting public resources for private gain.
 
  4. Community Free-Riders
    - Public Goods: Individuals who benefit from public goods or services (such as clean streets, public parks, or community events) without contributing to their maintenance or funding. This behavior can lead to overuse and degradation of shared resources.
 
  5. Fraudulent Claims
    - Insurance Fraud: Individuals who make fraudulent insurance claims, such as exaggerating damage or injuries to receive payouts they are not entitled to. This can increase premiums for others and strain insurance resources.
 
  6. Abuse of Institutional Systems
    - Exploiting Legal Loopholes: Using legal loopholes to gain unfair advantages, such as manipulating the legal system for personal benefit without regard for fairness or ethical considerations. This can include exploiting immigration laws or abusing bankruptcy protections.
 
 These examples reflect how "parasitic" behavior can manifest in various contexts, where individuals or groups take advantage of systems without contributing fairly, leading to inefficiencies and negative impacts on the broader community.`;
 } else if (userInput.includes('what is symbiosis')||(userInput.includes('define symbiosis'))) {
     response = `Symbiosis is a biological term that describes a close and long-term interaction between two different organisms. These interactions can be beneficial, neutral, or harmful to one or both parties involved. The term is derived from Greek, where "sym" means "together" and "biosis" means "living." There are several types of symbiotic relationships, each characterized by different degrees of interaction and benefit:
 
  1. Mutualism
    - Definition: Both organisms benefit from the relationship.
    - Examples:
      - Bees and Flowers: Bees pollinate flowers while feeding on their nectar. The flowers get pollinated, increasing their chances of reproduction, and the bees get food.
      - Clownfish and Sea Anemones: Clownfish live among the tentacles of sea anemones, gaining protection from predators, while the sea anemones get cleaned of parasites and food scraps from the clownfish.
 
  2. Commensalism
    - Definition: One organism benefits from the relationship, while the other is neither helped nor harmed.
    - Examples:
      - Birds and Trees: Birds may build nests in trees. The birds gain shelter, but the trees are not significantly affected by the presence of the nests.
      - Barnacles on Whales: Barnacles attach to the skin of whales, gaining access to nutrient-rich water as the whale swims. The whale is generally unaffected by the barnacles.
 
  3. Parasitism
    - Definition: One organism benefits at the expense of the other.
    - Examples:
      - Tapeworms in Mammals: Tapeworms live in the intestines of mammals, absorbing nutrients from the host’s food. The host suffers from nutrient loss and potential health issues.
      - Fleas on Dogs: Fleas feed on the blood of dogs, causing discomfort and potentially spreading diseases. The fleas benefit while the dogs are harmed.
 
  4. Neutralism
    - Definition: Both organisms live in close proximity but do not significantly affect each other.
    - Examples:
      - Cattle and Certain Birds: Cattle and certain birds may live in the same habitat, but the birds do not rely on the cattle for food or protection, and the cattle are generally unaffected by the presence of the birds.
 
  5. Amensalism
    - Definition: One organism is harmed while the other is unaffected.
    - Examples:
      - Penicillin-Producing Mold and Bacteria: The mold produces penicillin, which kills surrounding bacteria. The mold benefits by reducing competition, while the bacteria are harmed.
      - Large Trees and Understory Plants: Large trees can cast dense shade that inhibits the growth of smaller plants underneath. The trees are unaffected, but the smaller plants are harmed by reduced light.
 
 In summary, symbiosis encompasses a range of interactions between organisms that can influence their survival and well-being in various ways, from mutual benefit to one-sided advantage or detriment.`;
 } else if (userInput.includes('list the examples of symbiosis')||(userInput.includes('examples of symbiosis'))) {
     response = `Certainly! Here are some examples of different types of symbiotic relationships:
 
  1. Mutualism
 - Bees and Flowers: Bees pollinate flowers while feeding on nectar. The flowers get pollinated, and the bees obtain food.
 - Clownfish and Sea Anemones: Clownfish live among sea anemones' tentacles, getting protection from predators, while the sea anemones receive food scraps and are cleaned of parasites.
 - Mycorrhizae and Plants: Fungi (mycorrhizae) attach to plant roots, enhancing nutrient and water absorption for the plants, while the fungi receive carbohydrates produced by the plants.
 
  2. Commensalism
 - Barnacles on Whales: Barnacles attach to the skin of whales, gaining access to nutrient-rich water as the whale swims. The whale is generally unaffected.
 - Birds and Trees: Birds may use trees for nesting or perching. The trees are not significantly affected by the presence of the birds.
 - Remoras and Sharks: Remoras attach to sharks and other large marine animals, getting transportation and food scraps while not affecting the host.
 
  3. Parasitism
 - Tapeworms and Mammals: Tapeworms live in the intestines of mammals, absorbing nutrients from their host’s food, which can lead to health problems for the host.
 - Fleas and Dogs: Fleas feed on the blood of dogs, causing discomfort and potentially transmitting diseases. The fleas benefit while the dogs are harmed.
 - Cuckoo Birds and Other Bird Species: Cuckoo birds lay their eggs in the nests of other bird species. The host birds raise the cuckoo chicks at the expense of their own offspring.
 
  4. Neutralism
 - Cattle and Certain Birds: Cattle and certain birds may inhabit the same area, but the birds do not rely on the cattle, nor do the cattle benefit from the birds’ presence.
 - Red Foxes and Blue Jays: In some ecosystems, red foxes and blue jays may coexist without significantly affecting each other’s survival or reproduction.
 
  5. Amensalism
 - Penicillin-Producing Mold and Bacteria: The mold produces penicillin, which inhibits bacterial growth. The mold benefits by reducing competition, while the bacteria are harmed.
 - Black Walnut Trees and Understory Plants: Black walnut trees release juglone, a chemical that inhibits the growth of other plants nearby. The trees are unaffected, but the surrounding plants suffer from reduced growth.
 
 These examples illustrate the diversity of interactions between organisms in various ecosystems, highlighting how symbiotic relationships can impact survival, growth, and behavior in different ways.`;
 } else if (userInput.includes('forms of energy')||(userInput.includes('list the forms of energy'))) {
     response = `Energy exists in various forms, each with its own characteristics and applications. Here’s a list of the primary forms of energy:
 
  1. Kinetic Energy
    - Definition: The energy an object possesses due to its motion.
    - Examples: A moving car, flowing water, wind, and a flying baseball.
 
  2. Potential Energy
    - Definition: The energy stored in an object due to its position or state.
    - Types:
      - Gravitational Potential Energy: Energy stored due to an object’s height relative to the ground (e.g., water in a dam).
      - Elastic Potential Energy: Energy stored in stretched or compressed objects, like springs or rubber bands.
 
  3. Thermal Energy
    - Definition: The internal energy of an object due to the kinetic energy of its molecules; related to temperature.
    - Examples: Heat from a stove, geothermal energy, and the warmth of a cup of coffee.
 
  4. Chemical Energy
    - Definition: Energy stored in the bonds of chemical compounds, which can be released or absorbed during a chemical reaction.
    - Examples: Energy in food, gasoline, and batteries.
 
  5. Electrical Energy
    - Definition: Energy associated with the flow of electric charge through a conductor.
    - Examples: Electricity powering lights and appliances, and energy stored in capacitors.
 
  6. Nuclear Energy
    - Definition: Energy released during nuclear reactions, either through fission (splitting atomic nuclei) or fusion (combining atomic nuclei).
    - Examples: Energy from nuclear power plants, and the energy released by the sun.
 
  7. Radiant Energy (Electromagnetic Energy)
    - Definition: Energy carried by electromagnetic waves.
    - Types:
      - Visible Light: The portion of the electromagnetic spectrum visible to the human eye.
      - Infrared Radiation: Heat radiation emitted by objects.
      - Ultraviolet Radiation: Radiation from the sun that causes sunburn.
 
  8. Mechanical Energy
    - Definition: The sum of kinetic and potential energy in a system.
    - Examples: The energy in a moving car (kinetic) and the energy in a wound-up spring (potential).
 
  9. Sound Energy
    - Definition: Energy produced by vibrating objects and transmitted through a medium (like air or water) as sound waves.
    - Examples: Music from speakers, and the noise of a running engine.
 
  10. Elastic Energy
    - Definition: A form of potential energy stored when materials are stretched or compressed.
    - Examples: A stretched bowstring, or a compressed spring.
 
  11. Gravitational Energy
    - Definition: Potential energy associated with the gravitational field of an object due to its height.
    - Examples: Water behind a dam, or a book on a high shelf.
 
 Each form of energy can often be transformed into other forms through various processes and mechanisms, and understanding these forms is crucial in science and engineering for harnessing and utilizing energy effectively.`;
 } else if (userInput.includes('okay ')) {
     response = `fine if you have any thing else ask me`;
 } else if (userInput.includes('what is water')) {
     response = `a transparent, odorless, tasteless liquid, a compound of hydrogen and oxygen, H 2 O, freezing at 32°F or 0°C and boiling at 212°F or 100°C, that in a more or less impure state constitutes rain, oceans, lakes, rivers, etc.: it contains 11.188 percent hydrogen and 88.812 percent oxygen, by weight.`;
 } else if (userInput.includes('what is food')) {
     response = `any nutritious substance that people or animals eat or drink or that plants absorb in order to maintain life and growth.`;
 }else if (userInput.includes('what is air')) {
     response = `It's a mixture of different gases. The air in Earth's atmosphere is made up of approximately 78 percent nitrogen and 21 percent oxygen. Air also has small amounts of lots of other gases, too, such as carbon dioxide, neon, and hydrogen.`;
 }else if (userInput.includes('what is hydrosphere')) {
     response = `A hydrosphere is the total amount of water on a planet. The hydrosphere includes water that is on the surface of the planet, underground, and in the air. A planet's hydrosphere can be liquid, vapor, or ice. On Earth, liquid water exists on the surface in the form of oceans, lakes, and rivers.`;
 }else if (userInput.includes('what is litosphere')) {
     response = `The lithosphere is the solid, outer part of Earth. The lithosphere includes the brittle upper portion of the mantle and the crust, the outermost layers of Earth's structure. It is bounded by the atmosphere above and the asthenosphere (another part of the upper mantle) below.29 Nov 2023`;
 }else if (userInput.includes('what is biosphere')) {
     response = `The biosphere is the region of the Earth where life can be found, including the soil, water, and air. The lithosphere, hydrosphere, and atmosphere are the names for these three components. The lithosphere is the landmass of the Earth, except for the mantle and core, which are inhospitable to life.24 Dec 2021`;
 }else if (userInput.includes('what is cell')) {
     response = `In biology, the smallest unit that can live on its own and that makes up all living organisms and the tissues of the body. A cell has three main parts: the cell membrane, the nucleus, and the cytoplasm. The cell membrane surrounds the cell and controls the substances that go into and out of the cell.`;
 }else if (userInput.includes('what is death')) {
     response = `an individual who has sustained either (1) irreversible cessation of circulatory and respiratory functions, or (2) irreversible cessation of all functions of the entire brain, including the brain stem, is dead.`;
 }else if (userInput.includes('what is living things')) {
     response = `Living things are made up of a cell or cells. They obtain and use energy to survive. A unique ability to reproduce, ability to grow, ability to metabolize, ability to respond to stimuli, ability to adapt to the environment, ability to move, and last but not least an ability to respire.`;
 }else if (userInput.includes('what is alkalis')) {
     response = `A chemical that can dissolve in water, combine with acids to form salts, and make acids less acidic. Alkalis have a bitter taste and turn certain dyes blue.`;
 }else if (userInput.includes('what is non-living things')) {
     response = `Non-living things do not have a life span. They do not respire as they do not require food for energy and hence do not excrete. They do not fall into any cycle of birth, growth or death. They are created and destroyed by external forces. Examples of non-living things include stones, pens, books, cycles, bottles, etc.`;
 }else if (userInput.includes('list the characteristics of living things') ||(userInput.includes('what are the 7 main characteristics of living things'))||(userInput.includes('What are the main 7 characteristics of living things'))) {
     response = `These are the seven characteristics of living organisms.
 1 Nutrition. Living things take in materials from their surroundings that they use for growth or to provide energy. ...
 2 Respiration. ...
 3 Movement. ...
 4 Excretion. ...
 5 Growth.
 6 Reproduction. ...
 7 Sensitivity.
 `;
 }else if (userInput.includes('what is internet')) {
     response = `The Internet is a global network of billions of computers and other electronic devices. With the Internet, it's possible to access almost any information, communicate with anyone else in the world, and do much more. You can do all of this by connecting a computer to the Internet, which is also called going online.`;
 
 }else if (userInput.includes('what is life')) {
     response = `Life is defined as any system capable of performing functions such as eating, metabolizing, excreting, breathing, moving, growing, reproducing, and responding to external stimuli`;
 
 }else if (userInput.includes('what is life philosophy')) {
     response = `an overall vision of or attitude toward life and the purpose of life. 2. [translation of German Lebensphilosophie] : any of various philosophies that emphasize human life or life in general.`;
 
 }else if (userInput.includes(' what is optimism')) {
     response = `Optimism implies imbibing a positive outlook in your approach toward the present and the future. It’s the hopefulness and confidence that one does not let go of, even in challenging situations. Pessimistic is the opposite which eventually turns one into an apathetic. The sole difference between the two is the lens one chooses to see the world through, and you, and only you have the ability and control to make that choice.
 
 In philosophy, optimism is usually associated with Leibniz, he was the first to come up with the discussion and maintained that we live in the best of all possible worlds. Ralph Waldo Emerson said, “Every day is the best day in the year”.
 
 Having a positive outlook can change the way of living to a drastic level and keep a person mentally as well as physically, calm. There have been many surveys that conclude that an optimist is likely to live longer, have a better immune system, and 23 per cent less likely to die from heart diseases.`;
 
 }else if (userInput.includes('what is literature')) {
     response = `literature, a body of written works. The name has traditionally been applied to those imaginative works of poetry and prose distinguished by the intentions of their authors and the perceived aesthetic excellence of their execution.`;
 
 }else if (userInput.includes('branches of literature')) {
     response = `1. drama
     2.nonfiction
     3. poetry
     4.fiction
     5.legend
     6.biography`;
 
 }else if (userInput.includes('what is drama')) {
     response = `a composition in prose or verse presenting in dialogue or pantomime a story involving conflict or contrast of character, especially one intended to be acted on the stage; a play. the branch of literature having such compositions as its subject; dramatic art or representation.`;
 
 }else if (userInput.includes('what is poetry')) {
     response = `Poetry is a type of literature, or artistic writing, that attempts to stir a reader's imagination or emotions. The poet does this by carefully choosing and arranging language for its meaning, sound, and rhythm. Some poems, such as nursery rhymes, are simple and humorous.`;
 }else if (userInput.includes('what is prose')) {
     response = `Prose in English literature is a very common type of writing - it refers to any writing that follows the conventions of speech and language. As such, it's grammatically and syntactically correct, and flows like speech.`;
 }else if (userInput.includes('what is dance')) {
      response = `a small freshwater European cyprinid fish`;
    }else if (userInput.includes('hello, can you build a chat bot') || (userInput.includes('build a chat bot'))) {
        response = `Yes, I can help you build a chatbot! To get started, could you provide some details about what kind of chatbot you're looking to create For example:

1. Purpose: What will the chatbot be used for (e.g., customer service, personal assistant, educational tool)
2. Platform: Where will the chatbot be deployed (e.g., website, mobile app, messaging platforms like Facebook Messenger or WhatsApp)
3. Features: What features do you want the chatbot to have (e.g., natural language understanding, conversation history, integration with external services)
4. Technology: Do you have a preferred technology stack or framework (e.g., Python, JavaScript, Node.js, Dialogflow)

Providing more details will help me guide you better in building the chatbot.`;
    }else if (userInput.includes('it is not responding wonderful answers')) {
    response = `The example provided was a basic simulation and doesn’t include actual intelligence or advanced conversational abilities. To make the chatbot respond with more sophisticated answers, you need to integrate it with a service like OpenAI's GPT-4 API, which requires a backend server to handle API requests.

Here's a more detailed guide to integrating with OpenAI's GPT-4 API:

1. Setting Up Your Backend
You'll need a server to handle requests to the OpenAI API. Here’s a basic example using Node.js and Express:

Backend (Node.js with Express)
Install Dependencies

bash

npm install express body-parser axios
Create a File Named server.js

javascript

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" directory

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [{ role: 'user', content: userMessage }],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': \`Bearer YOUR_OPENAI_API_KEY\`,
                'Content-Type': \'application/json'
            }
        });

        const botMessage = response.data.choices[0].message.content;
        res.json({ reply: botMessage });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(\`Server running at http://localhost:\${port}\`);
});
Replace YOUR_OPENAI_API_KEY with your actual API key from OpenAI.

Run the Server

bash

node server.js
2. Updating the Frontend
Modify the JavaScript in your HTML file to send requests to your backend server:

javascript

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessageToChat('user', userInput);
    document.getElementById('user-input').value = '';

    // Call your backend API here
    const botResponse = await getBotResponse(userInput);
    addMessageToChat('bot', botResponse);
}

async function getBotResponse(userInput) {
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
    });
    const data = await response.json();
    return data.reply;
}
3. Setting Up Your Project Structure
Your project directory should look something like this:

bash

/your-project
  /public
    index.html
    styles.css
    script.js
  server.js
4. Testing
Start the Node.js server with node server.js.
Open your index.html in a browser or use a local server to serve it.
Test the chatbot by typing messages and receiving responses powered by GPT-4.
This setup should give you a functional chatbot with responses generated by OpenAI's GPT-4. If you have any more questions or need further customization, feel free to ask!`;
    }else if (userInput.includes('you are  mad create an AI using HTML, CSS and JS') ||(userInput.includes('using html css and js build a chat bot'))||(userInput.includes('using html css and js build an ai chat bot'))) {
      response = `Creating a fully functional AI chatbot purely with HTML, CSS, and JavaScript (without any backend or external services) is quite limited. While JavaScript can handle basic interactions and simulate responses, it can't provide advanced AI functionality like GPT-4. However, you can build a simple rule-based chatbot that responds with pre-defined answers.

Here’s an example of how to create a basic rule-based chatbot using only HTML, CSS, and JavaScript:

HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Chatbot</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="chat-container">
        <div class="chat-box" id="chat-box"></div>
        <input type="text" id="user-input" placeholder="Type a message...">
        <button onclick="sendMessage()">Send</button>
    </div>
    <script src="script.js"></script>
</body>
</html>
CSS
css

body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f4f4f9;
}

.chat-container {
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.chat-box {
    height: 400px;
    overflow-y: scroll;
    padding: 10px;
    background-color: #fff;
}

.chat-box .message {
    margin: 10px 0;
}

.chat-box .message.user {
    text-align: right;
}

.chat-box .message.bot {
    text-align: left;
}

input[type="text"] {
    width: calc(100% - 70px);
    padding: 10px;
    border: 1px solid #ccc;
    border-right: none;
}

button {
    width: 70px;
    padding: 10px;
    background-color: #007bff;
    border: none;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
JavaScript


const responses = {
    "hello": "Hi there! How can I help you",
    "how are you": "I'm just a bot, but I'm doing great! How about you",
    "what is your name": "I'm a chatbot. I don't have a name.",
    "default": "Sorry, I don't understand that."
};

function sendMessage() {
    const userInput = document.getElementById('user-input').value.toLowerCase();
    if (userInput.trim() === '') return;

    addMessageToChat('user', userInput);
    document.getElementById('user-input').value = '';

    // Get bot response
    const botResponse = getBotResponse(userInput);
    addMessageToChat('bot', botResponse);
}

function getBotResponse(userInput) {
    return responses[userInput] || responses['default'];
}

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
Explanation
HTML: Sets up the basic structure of the chat interface.
CSS: Styles the chatbox to make it visually appealing.
JavaScript: Handles user input and generates bot responses based on predefined rules.
Limitations
Rule-based: The chatbot can only respond to predefined inputs. It doesn’t learn or understand beyond the specified rules.
No AI: It doesn’t have any AI capabilities and can't handle complex or unexpected inputs.
If you want a more sophisticated chatbot, integrating with an AI service like OpenAI's GPT-4 would be necessary. Let me know if you need any more help or if you'd like to explore other features!`;
    }else if (userInput.includes('in js, use "else if (userinput.includes(\'\'){\"')) {
       response = `Using else if statements with includes is a good way to create a more flexible rule-based chatbot. This allows the chatbot to recognize parts of the user's input and respond accordingly.

Here's an updated version of the JavaScript code using else if and includes to handle various user inputs:

JavaScript
javascript
Copy code
function sendMessage() {
    const userInput = document.getElementById('user-input').value.toLowerCase();
    if (userInput.trim() === '') return;

    addMessageToChat('user', userInput);
    document.getElementById('user-input').value = '';

    // Get bot response
    const botResponse = getBotResponse(userInput);
    addMessageToChat('bot', botResponse);
}

function getBotResponse(userInput) {
    if (userInput.includes('hello') || userInput.includes('hi')) {
        return "Hi there! How can I help you";
    } else if (userInput.includes('how are you')) {
        return "I'm just a bot, but I'm doing great! How about you";
    } else if (userInput.includes('what is your name')) {
        return "I'm a chatbot. I don't have a name.";
    } else if (userInput.includes('thank you') || userInput.includes('thanks')) {
        return "You're welcome!";
    } else if (userInput.includes('bye') || userInput.includes('goodbye')) {
        return "Goodbye! Have a great day!";
    } else {
        return "Sorry, I don't understand that.";
    }
}

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
Explanation
userInput.includes('...'): This checks if the user's input contains a specific keyword or phrase.
else if: Allows for multiple conditions to be checked in sequence.
addMessageToChat: Adds the message to the chat window.
Example
If a user types "hello," the chatbot will respond with "Hi there! How can I help you" If the input contains "thanks," it will respond with "You're welcome!"

This setup makes the chatbot more interactive and capable of handling a wider range of user inputs. If you need more sophisticated responses or dynamic interactions, you would still need to integrate with an AI service or backend logic.`;
    }else if (userInput.includes('put it ever possible questions in all subject in this world with their answer')) {
       response = `Creating a chatbot that can answer every possible question on all subjects in the world is a monumental task, as it requires an extensive and continually updated knowledge base. However, I can provide a more manageable example with a range of common questions across various subjects.

Here’s an example of how to implement a chatbot with a broad set of predefined questions and answers:

JavaScript
javascript
Copy code
const responses = {
    // General Greetings
    "hello": "Hi there! How can I help you",
    "hi": "Hello! How can I assist you today",
    "good morning": "Good morning! How can I help you",
    "good afternoon": "Good afternoon! How can I assist you",
    "good evening": "Good evening! What can I do for you",
    "goodbye": "Goodbye! Have a great day!",
    "bye": "Bye! Take care!",

    // General Information
    "what is your name": "I'm a chatbot. I don't have a name.",
    "how are you": "I'm just a bot, but I'm doing great! How about you",
    "what is the time": "I'm unable to check the time. You can look at your device's clock.",
    "what is the date": "I can't provide the date, but you can check your device's calendar.",

    // Basic Math
    "what is 2 plus 2": "2 plus 2 is 4.",
    "what is 10 minus 3": "10 minus 3 is 7.",
    "what is 5 times 5": "5 times 5 is 25.",
    "what is 20 divided by 4": "20 divided by 4 is 5.",

    // Science
    "what is the boiling point of water": "The boiling point of water is 100°C (212°F) at standard atmospheric pressure.",
    "what is the chemical symbol for gold": "The chemical symbol for gold is Au.",
    "what is the speed of light": "The speed of light is approximately 299,792 kilometers per second (or about 186,282 miles per second).",

    // Geography
    "what is the capital of France": "The capital of France is Paris.",
    "which is the largest continent": "Asia is the largest continent by both area and population.",
    "what is the longest river in the world": "The Nile River is often considered the longest river in the world, though some sources argue that the Amazon River is longer.",

    // History
    "who was the first president of the United States": "The first president of the United States was George Washington.",
    "when did World War II end": "World War II ended on September 2, 1945.",
    "who discovered America": "Christopher Columbus is often credited with discovering America in 1492, although indigenous peoples had been living there long before his arrival.",

    // Technology
    "what is the latest iPhone model": "As of now, the latest iPhone model is the iPhone 15. (Note: This information might be outdated.)",
    "what is JavaScript": "JavaScript is a programming language commonly used in web development to create interactive effects within web browsers.",
    "what is AI": "AI stands for Artificial Intelligence, which is the simulation of human intelligence in machines programmed to think and learn like humans.",

    // Miscellaneous
    "what is the meaning of life": "The meaning of life is a philosophical question that has been debated for centuries. It can vary based on personal beliefs and values.",
    "who is the author of '1984'": "The author of '1984' is George Orwell.",
    "what is the currency of Japan": "The currency of Japan is the Japanese Yen (JPY).",

    // Default Response
    "default": "Sorry, I don't understand that."
};

function sendMessage() {
    const userInput = document.getElementById('user-input').value.toLowerCase();
    if (userInput.trim() === '') return;

    addMessageToChat('user', userInput);
    document.getElementById('user-input').value = '';

    // Get bot response
    const botResponse = getBotResponse(userInput);
    addMessageToChat('bot', botResponse);
}

function getBotResponse(userInput) {
    for (const key in responses) {
        if (userInput.includes(key)) {
            return responses[key];
        }
    }
    return responses['default'];
}

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
Explanation
responses Object: Contains a broad range of predefined questions and answers. This example includes basic greetings, general information, math questions, and more.
getBotResponse Function: Iterates through the responses object to find a match based on userInput. If no match is found, it returns a default response.
sendMessage Function: Handles user input, retrieves the appropriate response, and updates the chatbox.
This setup demonstrates a chatbot with a range of predefined answers. For a comprehensive knowledge base, you'd need to continuously expand and update the responses object or integrate with a more advanced AI system.`
    }else if (userInput.includes('in js, use "else if (userinput.includes(\'questions\'){response = answer}"')) {
      response = `Certainly! You can use \`else if\` statements combined with \`includes\` to handle various questions and provide responses. Here’s an updated example that demonstrates how to use \`else if\` to match specific questions and provide corresponding answers.

 JavaScript Example

\`javascript
function sendMessage() {
    const userInput = document.getElementById('user-input').value.toLowerCase();
    if (userInput.trim() === '') return;

    addMessageToChat('user', userInput);
    document.getElementById('user-input').value = '';

    // Get bot response
    const botResponse = getBotResponse(userInput);
    addMessageToChat('bot', botResponse);
}

function getBotResponse(userInput) {
    let response;

    if (userInput.includes('hello') || userInput.includes('hi')) {
        response = "Hi there! How can I help you";
    } else if (userInput.includes('how are you')) {
        response = "I'm just a bot, but I'm doing great! How about you";
    } else if (userInput.includes('what is your name')) {
        response = "I'm a chatbot. I don't have a name.";
    } else if (userInput.includes('thank you') || userInput.includes('thanks')) {
        response = "You're welcome!";
    } else if (userInput.includes('bye') || userInput.includes('goodbye')) {
        response = "Goodbye! Have a great day!";
    } else if (userInput.includes('what is the time')) {
        response = "I'm unable to check the time. You can look at your device's clock.";
    } else if (userInput.includes('what is the date')) {
        response = "I can't provide the date, but you can check your device's calendar.";
    } else if (userInput.includes('what is 2 plus 2')) {
        response = "2 plus 2 is 4.";
    } else if (userInput.includes('what is 10 minus 3')) {
        response = "10 minus 3 is 7.";
    } else if (userInput.includes('what is 5 times 5')) {
        response = "5 times 5 is 25.";
    } else if (userInput.includes('what is 20 divided by 4')) {
        response = "20 divided by 4 is 5.";
    } else if (userInput.includes('boiling point of water')) {
        response = "The boiling point of water is 100°C (212°F) at standard atmospheric pressure.";
    } else if (userInput.includes('chemical symbol for gold')) {
        response = "The chemical symbol for gold is Au.";
    } else if (userInput.includes('speed of light')) {
        response = "The speed of light is approximately 299,792 kilometers per second (or about 186,282 miles per second).";
    } else if (userInput.includes('capital of France')) {
        response = "The capital of France is Paris.";
    } else if (userInput.includes('largest continent')) {
        response = "Asia is the largest continent by both area and population.";
    } else if (userInput.includes('longest river in the world')) {
        response = "The Nile River is often considered the longest river in the world, though some sources argue that the Amazon River is longer.";
    } else if (userInput.includes('first president of the United States')) {
        response = "The first president of the United States was George Washington.";
    } else if (userInput.includes('when did World War II end')) {
        response = "World War II ended on September 2, 1945.";
    } else if (userInput.includes('who discovered America')) {
        response = "Christopher Columbus is often credited with discovering America in 1492, although indigenous peoples had been living there long before his arrival.";
    } else if (userInput.includes('latest iPhone model')) {
        response = "As of now, the latest iPhone model is the iPhone 15. (Note: This information might be outdated.)";
    } else if (userInput.includes('JavaScript')) {
        response = "JavaScript is a programming language commonly used in web development to create interactive effects within web browsers.";
    } else if (userInput.includes('AI')) {
        response = "AI stands for Artificial Intelligence, which is the simulation of human intelligence in machines programmed to think and learn like humans.";
    } else {
        response = "Sorry, I don't understand that.";
    }

    return response;
}

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}


 Explanation

-\`getBotResponse\` Function David: Uses \`else if\` to check if \`userInput\` includes certain keywords or phrases and sets \`response\` accordingly.
-\`sendMessage\` Function David: Handles user input, retrieves the response from \`getBotResponse\`, and updates the chat window.
-\`addMessageToChat\` Function David: Displays the message in the chat window.

This approach handles specific phrases and keywords, providing responses based on predefined conditions. It’s a more manageable way to create a rule-based chatbot with JavaScript.`;
    }else if (userInput.includes('using html, css and js, build a responsible chat bot that give answer like chatgpt')) {
       response = `Creating a fully functional chatbot that answers like ChatGPT using only HTML, CSS, and JavaScript is quite complex because ChatGPT's capabilities are powered by advanced machine learning models hosted on servers. However, I can help you create a simple web-based chatbot interface that mimics the look and feel of a chatbot, and you can integrate it with a backend service like OpenAI's API to get responses.

Here's a basic example to get you started:

                                      HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="chat-container">
        <div class="chat-box" id="chat-box"></div>
        <input type="text" id="user-input" placeholder="Type a message...">
        <button onclick="sendMessage()">Send</button>
    </div>
    <script src="script.js"></script>
</body>
</html>
                       CSS
body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f4f4f9;
}

.chat-container {
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.chat-box {
    height: 400px;
    overflow-y: scroll;
    padding: 10px;
    background-color: #fff;
}

.chat-box .message {
    margin: 10px 0;
}

.chat-box .message.user {
    text-align: right;
}

.chat-box .message.bot {
    text-align: left;
}

input[type="text"] {
    width: calc(100% - 70px);
    padding: 10px;
    border: 1px solid #ccc;
    border-right: none;
}

button {
    width: 70px;
    padding: 10px;
    background-color: #007bff;
    border: none;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
                                        JavaScript

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessageToChat('user', userInput);
    document.getElementById('user-input').value = '';

    // Simulating bot response
    setTimeout(() => {
        const botResponse = "This is a simulated response.";
        addMessageToChat('bot', botResponse);
    }, 1000);
}

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
Explanation
HTML: Sets up the basic structure of the chatbot interface.
CSS: Styles the chatbot for a cleaner and more user-friendly appearance.
JavaScript: Handles the sending of messages and adds them to the chatbox. It also simulates a bot response.
To integrate with an actual backend service like OpenAI's API, you would need to replace the simulated bot response with an API call to the OpenAI service. Here’s an example of how you might modify the sendMessage function to call an API:
To integrate with an actual backend service like OpenAI's API, you would need to replace the simulated bot response with an API call to the OpenAI service. Here’s an example of how you might modify the sendMessage function to call an API:

javascript
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessageToChat('user', userInput);
    document.getElementById('user-input').value = '';

    // Call your backend API here
    const botResponse = await getBotResponse(userInput);
    addMessageToChat('bot', botResponse);
}

async function getBotResponse(userInput) {
    // Replace with your API endpoint and key
    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({ message: userInput })
    });
    const data = await response.json();
    return data.reply;
}
This code snippet demonstrates how to send the user's message to an API endpoint and display the response in the chat. You will need to set up a backend service to handle the request and connect to the OpenAI API or any other chatbot service you prefer.
`;
  } else if (userInput.includes('what is motion')) {
     response = `the action or process of moving or of changing place or position; movement. power of movement, as of a living body. the manner of moving the body in walking; gait.`;
 }else if (userInput.includes('what is dictionary')) {
         response = `a book or electronic resource that lists the words of a language (typically in alphabetical order) and gives their meaning, or gives the equivalent words in a different language, often also providing information about pronunciation, origin, and usage.
 "I'll look up 'love' in the dictionary"`;
 }else if (userInput.includes('what is accident')) {
         response = `a book or electronic resource that lists the words of a language (typically in alphabetical order) and gives their meaning, or gives the equivalent words in a different language, often also providing information about pronunciation, origin, and usage.
 "I'll look up 'love' in the dictionary"`;
} else if (userInput.includes('what is ai')) {
    response = "AI stands for Artificial Intelligence, which is the simulation of human intelligence in machines programmed to think and learn like humans.";
 } else if (userInput.includes('coded ai honestly what is your purpose')||(userInput.includes('what can you do')) ||(userInput.includes('what is your purpose')) ||(userInput.includes('coded AI honestly what is your purpose')) ) {
     response = `Answering questions on topics like science, history, technology, and more.Providing explanations for concepts or ideas.Assisting with coding in languages like HTML, CSS, and JavaScript.Generating creative content, such as stories or poems.Helping with language learning, including grammar and vocabulary.Offering study tips or summarizing information.Giving advice on projects or brainstorming ideas.If there\'s something specific you need, just let me know!.`;
     
 } else if (userInput.includes('show me basic js codes')||(userInput.includes('show me basic javascript code'))||(userInput.includes('show me basic js code'))) {
   response= `Here are some basic JavaScript examples:

 1. Displaying an Alert:

html
<!DOCTYPE html>
<html>
<head>
  <title>Basic JS Example</title>
</head>
<body>
  <button onclick="showAlert()">Click me</button>

  <script>
    function showAlert() {
      alert("Hello, world!");
    }
  </script>
</body>
</html>

This code creates a button that, when clicked, displays an alert with the message "Hello, world!".



 2. Changing Text Content:

html
<!DOCTYPE html>
<html>
<head>
  <title>Basic JS Example</title>
</head>
<body>
  <p id="text">Original text</p>
  <button onclick="changeText()">Change Text</button>

  <script>
    function changeText() {
      document.getElementById("text").innerHTML = "Text has been changed!";
    }
  </script>
</body>
</html>


In this example, clicking the button changes the content of the paragraph.


 3. Simple Addition:

html
<!DOCTYPE html>
<html>
<head>
  <title>Basic JS Example</title>
</head>
<body>
  <p>Result: <span id="result"></span></p>
  <button onclick="addNumbers()">Add 5 + 3</button>

  <script>
    function addNumbers() {
      var result = 5 + 3;
      document.getElementById("result").innerHTML = result;
    }
  </script>
</body>
</html>

When you click the button, the sum of \`5 + 3\` will be displayed inside the \`<span>\` element.`;
 } else if (userInput.includes('show me the css codes for designing a chat bot') ||(userInput.includes('show me the css code for designing an ai chat bot'))||(userInput.includes('show css codes for building a chat bot'))) {
   response = `for designing a bot chart, here is the codes.
          body {
 font-family: bauhaus 93;
 background-color: wheat;
 padding: 20px;
 margin: auto;
 box-sizing: border-box;
 }
 .color{
 background-color: whitesmoke;
 border-radius: 30px;
 border: solid 1px red;
 }
 chatContainer {
 width: 600px;
 height: 970px;
 border: 18px double magenta;
 background-color: whitesmoke;
 padding: 10px;
 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
 margin-left: 676px;
 margin-top: 200px;
 border-radius: 50px;
 cursor: pointer;
 }
 chatInput {
 flex: 1;
 padding: 10px;
 border: solid 5px wheat;
 border-radius: 20px;
 margin-right: 10px;
 background-color: rgb(249, 249, 249);
 cursor: pointer;
 margin-left: 150px;
 width: 50%;
 }
 .chat-header {
 color: rgb(2, 2, 94);
 font-family: Algerian;
 font-size: 15px;
 text-align: center;
 background-color: whitesmoke;
 height: 50px;
 }
 chatBody {
 height: 800px;
 overflow-y: auto;
 margin-bottom: 10px;
 background-color: rgb(199, 248, 248);
 border-radius: 50px;
 border: solid 10px wheat;
 }
 
 .user-message {
 text-align: right;
 margin: 5px;
 padding: 5px;
 background-color: rgb(173, 173, 172);
 border-radius: 5px;
 color: white;
 }
 
 .en{
 color: rgb(2, 2, 94);
 font-family: Algerian;
 font-size: xx-large;
 text-align: center;
 background-color: whitesmoke;
 height: 50px;
 text-decoration-line: overline;
 }
 
 .bot-message {
 text-align: left;
 margin: 5px;
 padding: 5px;
 background-color: rgb(238, 131, 165);
 border-radius: 5px;
 color: black;
 }
 
 .bot-table {
 width: 100%;
 border-collapse: collapse;
 margin: auto;
 }
 
 .bot-table td {
 border: 1px solid ccc;
 padding: 8px;
 text-align: center;
 }
 
 .bot-table tr:nth-child(even) {
 background-color: f2f2f2;
 }
 sendButton {
 padding: 10px 20px;
 background-color: 007bff;
 color: white;
 border: none;
 border-radius: 20px;
 cursor: pointer;
 }`;
 } else if (userInput.includes('what is your name')) {
     response = `My name is coded AI chat bot build by David`;

    } else if (userInput.includes('what is technology')) {
        response = `Technology refers to the application of scientific knowledge for practical purposes, especially in industries. It encompasses tools, systems, machines, and methods used to solve problems or perform specific tasks. Technology can range from simple tools, like a hammer or wheel, to complex systems, like computers, smartphones, and the internet. Its goal is to make tasks easier, improve efficiency, and enhance the quality of life.`;

    } else if (userInput.includes('what is economic institution')||(userInput.includes('define economic institution'))) {
        response = `An economic institution refers to an established system, structure, or organization that plays a role in the functioning of an economy. These institutions set the rules, norms, and standards for economic activities like production, distribution, and consumption of goods and services. Examples of economic institutions include banks, financial markets, labor unions, property rights systems, and regulatory bodies. These institutions help shape economic behavior, guide transactions, and influence overall economic stability and growth.`;

    } else if (userInput.includes('what is educational institution')||(userInput.includes('define educational institution'))) {
        response = `An educational institution is an organization or establishment dedicated to providing education and fostering learning. It includes schools, colleges, universities, and vocational training centers that offer formal instruction at various levels—primary, secondary, and higher education. These institutions are responsible for imparting knowledge, skills, and values to individuals, preparing them for personal development, careers, and active participation in society. Educational institutions are often governed by specific policies, curricula, and standards to ensure quality education.`;

    } else if (userInput.includes('what is social institution')||(userInput.includes('define social institution'))) {
        response = `A social institution is an organized and established system of social relationships, behaviors, and norms that help meet the needs of society and regulate human behavior. These institutions serve to structure social interactions and provide stability by governing specific areas of life. Common examples of social institutions include the family, education, religion, government, and the economy. Each institution plays a crucial role in shaping social order, culture, and the values within a society, ensuring that individuals work together and fulfill collective goals.`;

    } else if (userInput.includes('types of social institution')||(userInput.includes('examples of social institution'))) {
        response = `Social institutions are organized into several key types, each serving a different function within society. The main types of social institutions include:

1. Family: Focuses on reproduction, care, and socialization of children, as well as providing emotional and economic support to its members.
   
2. Education: Transmits knowledge, skills, values, and culture from one generation to another, while preparing individuals for roles in the workforce and society.

3. Religion: Provides moral guidance, spiritual support, and a system of beliefs and practices that influence how individuals understand and interact with the world.

4. Government (or Politics): Establishes and enforces laws, manages public resources, provides leadership, and maintains social order through authority and power.

5. Economy: Manages the production, distribution, and consumption of goods and services, regulating economic activities and ensuring the survival of society.

6. Health Care: Focuses on maintaining and improving health through medical services, health education, and research to prevent and treat illnesses.

7. Legal System (Law): Enforces laws and social norms, resolving disputes and protecting rights through a structured legal process, promoting justice.

8. Media: Distributes information, shapes public opinion, and provides entertainment, influencing societal norms, values, and behavior.

These institutions work together to create a cohesive and functioning society, each addressing specific social needs and contributing to overall social stability.`;

    } else if (userInput.includes('what is religion')||(userInput.includes('define religion'))) {
        response = `Religion is a system of beliefs, practices, and values centered around the idea of the sacred or divine. It typically involves worship or reverence for one or more deities, along with rituals, moral codes, and worldviews that guide the behavior of its followers. Religion helps individuals and communities make sense of life, understand their purpose, and cope with existential questions like the meaning of existence, life after death, and the nature of good and evil.

Religions often provide spiritual guidance, cultural identity, and a sense of community, while also addressing ethical and moral concerns. Major world religions include Christianity, Islam, Hinduism, Buddhism, and Judaism, though there are many other belief systems worldwide.`;

    } else if (userInput.includes('what is political institution')||(userInput.includes('define political institution'))) {
        response = `A political institution refers to an established structure or system that organizes, governs, and regulates the political life of a society. These institutions are responsible for creating laws, enforcing rules, distributing power, and managing resources within a country or community. Political institutions include governments, political parties, parliaments, courts, and other entities involved in decision-making and the maintenance of social order.

They play a crucial role in shaping the behavior of individuals and groups within a society, ensuring stability, protecting rights, and providing mechanisms for conflict resolution and policy implementation. Political institutions vary in form and structure, depending on the type of government (democracy, monarchy, authoritarianism, etc.) in place.`;
    
    } else if (userInput.includes('what is legal institution')||(userInput.includes('define legal institution'))) {
        response = `A legal institution is a system or structure established to create, interpret, and enforce laws within a society. These institutions are designed to uphold justice, protect individual rights, resolve disputes, and maintain social order by ensuring that laws are followed. Legal institutions include courts, law enforcement agencies (such as the police), and regulatory bodies that oversee the application of laws.
The judiciary, comprising various levels of courts, is a core part of the legal institution and is responsible for interpreting laws and delivering justice in legal disputes. Legal institutions function based on a country's legal framework, which could be based on common law, civil law, religious law, or a combination of these systems.`;
    } else if (userInput.includes('what is religious institution')||(userInput.includes('define religious institution'))) {
        response = `A religious institution is an organized body or structure that governs the practice, belief system, and rituals of a particular religion. These institutions provide a formal framework for religious activities such as worship, prayer, ceremonies, and the dissemination of religious teachings. They also help maintain the traditions, values, and doctrines of a religion, while offering spiritual guidance and community support to followers.

Examples of religious institutions include churches, mosques, temples, synagogues, monasteries, and other places of worship. They are often led by clergy or religious leaders (such as priests, imams, rabbis, monks, etc.) and play a key role in shaping moral behavior, fostering a sense of belonging, and helping individuals and communities navigate life's challenges according to their faith.`;
    } else if (userInput.includes('types of economic institution')||(userInput.includes('examples of '))) {
        response = `Economic institutions are structures or organizations that influence economic activity and the allocation of resources within a society. Key types of economic institutions include:

1. Financial Institutions: These include banks, credit unions, insurance companies, and investment firms that provide financial services, such as managing money, lending, and investing.

2. Marketplaces: Places where goods and services are exchanged, including stock exchanges, commodity markets, and online marketplaces.

3. Government Agencies: Entities responsible for regulating and overseeing economic activity, such as central banks, financial regulatory bodies, and trade commissions.

4. Businesses and Corporations: Organizations involved in producing goods and services, including private enterprises, multinational corporations, and small businesses.

5. Labor Unions: Organizations that represent workers and negotiate on their behalf for better wages, working conditions, and benefits.

6. Trade Associations: Groups that represent businesses within specific industries and work to promote their interests and standards.

7. Educational and Research Institutions: Entities that provide training and research on economic theories, practices, and innovations, influencing economic policies and practices.

8. Non-Governmental Organizations (NGOs): Organizations that address economic issues, such as poverty, development, and sustainability, often through advocacy and program implementation.

These institutions collectively shape economic behavior, influence market outcomes, and contribute to the overall functioning and stability of an economy.`;
    
    } else if (userInput.includes('types of educational institution')||(userInput.includes('examples of '))) {
        response = `Educational institutions vary in purpose, level of education, and specialization. Here are the main types:

1. Preschools/Kindergartens: Early childhood education centers that focus on the developmental needs of young children before they enter primary school.

2. Primary Schools (Elementary Schools): Institutions providing foundational education to children, typically from kindergarten through 5th or 6th grade, focusing on basic literacy, numeracy, and social skills.

3. Secondary Schools (Middle Schools and High Schools): Schools offering education to adolescents, usually from grades 6 through 12, preparing students for higher education or vocational training.

4. Vocational/Technical Schools: Institutions providing specialized training and skills for specific trades or careers, such as automotive repair, culinary arts, or information technology.

5. Community Colleges: Offer two-year associate degrees, vocational training, and transfer programs to four-year institutions. They often focus on providing accessible higher education and career preparation.

6. Universities: Higher education institutions that offer undergraduate, graduate, and doctoral programs across various fields of study. They conduct research and provide advanced training and degrees.

7. Specialized Schools: Institutions focusing on specific areas of study, such as art schools, music conservatories, or schools for the gifted and talented.

8. Online Education Platforms: Virtual institutions providing courses, certifications, and degrees through online platforms, allowing for flexible learning.

9. Adult Education Centers: Offer continuing education, literacy programs, and skill development for adults seeking to improve their knowledge or career prospects.

10. Research Institutes: Specialized institutions dedicated to conducting research and advancing knowledge in specific fields, often affiliated with universities or independent entities.

Each type of educational institution serves distinct roles in the education system, catering to different needs and stages of learning.`;
    } else if (userInput.includes('types of religion')||(userInput.includes('examples of '))) {
        response = `Religion encompasses a wide range of belief systems and practices, and various types can be categorized based on their doctrines, rituals, and organizational structures. Here are some major types of religions:

Theistic Religions: Belief in one or more deities.

Monotheism: Belief in a single, all-powerful deity. Examples include Christianity, Islam, and Judaism.
Polytheism: Belief in multiple deities, each with specific roles and attributes. Examples include Hinduism and ancient Greek and Roman religions.
Non-Theistic Religions: Focus on philosophies, ethics, and practices rather than deities.

Buddhism: Focuses on the teachings of Siddhartha Gautama (Buddha) and emphasizes the Four Noble Truths and the Eightfold Path.
Confucianism: Centers on the teachings of Confucius, focusing on ethics, family, and social harmony.
Pantheistic Religions: Belief that the divine is present in all things and that the universe itself is divine. Examples include some forms of Hinduism and certain New Age spiritualities.

Animism: Belief that natural objects, animals, and the environment possess spiritual essence or consciousness. Common in indigenous and tribal religions.

Shamanism: Involves the practice of shamans who communicate with the spirit world through rituals and trance states. Often found in indigenous cultures.

Secularism: While not a religion per se, secularism involves a non-religious approach to life and governance, emphasizing separation from religious institutions and focusing on reason and science.

Humanism: Focuses on human values and concerns, often without reference to the divine. It promotes ethical living based on reason and empathy.

Mysticism: A belief system centered around seeking direct, personal experiences of the divine or ultimate reality. Found within various religious traditions, including Sufism in Islam and Kabbalah in Judaism.

New Religious Movements: Modern or contemporary religions that often incorporate elements from traditional religions or new ideas. Examples include the Church of Scientology and the Bahá'í Faith.`;

    
 } else if (userInput.includes('i want to do my assignment') ||(userInput.includes('I want to do my assignment')) ||userInput.includes('i want to chat you')||userInput.includes('I want to chat you') ||(userInput.includes('i want to do my home work'))||(userInput.includes('i want to do my homework'))) {
     response = `you are free to do that`;
 
 } else if (userInput.includes('the branches of physics are divided into how many')) {
    response = 'the branches physics are divided into many parts.';
 } else if (userInput.includes('i want to learn codes') || userInput.includes('I want to learn codes')|| userInput.includes('I want to learn code')) {
     response = 'are you sure you will understand.';
    } else if (userInput.includes('can you play music')) {
        response = `I can not play music but i can answer questions, and i can not give remix`
 } else if (userInput.includes('yes')) {
     response = 'okay go on with your questions';

    } else if (userInput.includes('what is algorithm')||(userInput.includes('define algorithm'))) {
        response = `An algorithm is a step-by-step procedure or a set of rules to solve a problem or perform a task. It is like a recipe that tells you exactly what to do in a specific order to achieve a particular outcome.

For example, an algorithm for making a cup of tea might include steps like:
1. Boil water.
2. Place a tea bag in a cup.
3. Pour the hot water over the tea bag.
4. Let the tea steep for a few minutes.
5. Remove the tea bag and add sugar or milk if desired.

In computer science, algorithms are used to perform calculations, data processing, automated reasoning, and other tasks by computers.`;

    } else if (userInput.includes('sketch a graph to illustrate charle\'s law')) {
        response = `To sketch the graph:

Label the axes:

Label the horizontal axis as 
𝑇 (temperature in Kelvin).Label the vertical axis as 
 V (volume).
Choose a scale:

Start the temperature axis from absolute zero (0 Kelvin) and extend it to a higher temperature range.
The volume axis should be scaled to accommodate the expected volume values.
Plot the points or draw the curve:

Charles's Law states that 
𝑉𝑇=constant
​
 =constant. This means as temperature increases, volume should increase proportionally. You can plot several points or draw a curve that illustrates this proportional relationship.
If you have specific data points or if you're illustrating the concept, plot points such as (0 K, 0 V) and other points at higher temperatures that show the volume increasing proportionally with temperature.
Label and title:

Label the axes clearly with "Temperature (K)" and "Volume".
Add a title to the graph such as "Illustration of Charles's Law".
Smooth the curve:

Draw a smooth curve through the points, emphasizing the direct proportionality between volume and temperature at constant pressure.
Here’s a simple ASCII representation of how such a graph might look:

mathematica

         ^
Volume   |
         |          
         |       
         |    
         |  
         |
         +------------------------------>
         Temperature (K)
In this sketch:

As temperature increases along the x-axis (Temperature in Kelvin), the volume (y-axis) also increases, illustrating the direct proportionality as per Charles's Law.
This graph visually demonstrates how volume increases with temperature according to Charles's Law when pressure is held constant.`;
    
 } else if (userInput.includes('are you sure')) {
     response = `yes but don't ask me too much questions. And why did you ask me for the first time`;
 
 } else if (userInput.includes('nothing')) {
     response = `be warned`;
    } else if (userInput.includes('who was the first president of the united states')||(userInput.includes('who was the 1st president of united states'))) {
        response = `The first president of the United States was George Washington. He served two terms as president, from 1789 to 1797, and is widely regarded as one of the Founding Fathers of the nation. Washington was unanimously elected as the first president and played a crucial role in establishing many of the principles and traditions of the U.S. presidency.`;
    } else if (userInput.includes('introduce your self.')||(userInput.includes('give more information about eho you are'))||(userInput.includes('introduce yourself'))) {
        response = `I am an AI chat bot Build by A scientist name "EGBUJI DAVID KENECHUKWU" in the year August 40th, 2024. I was programmed just for a Fun And also answering small small questions being programed in me, and you can get my location in you connected website by typing "ChatDEK 3.5 AI", And press "EGBUJI DAVID FUN AI...." and wait for some times to generate. I am not an advance AI but 0% Advance AI`;
    } else if (userInput.includes('show me basic html code')||(userInput.includes('show me basic html codes'))) {
        response = `Here's a basic example of HTML code:

html
<!DOCTYPE html>
<html>
<head>
  <title>Basic HTML Page</title>
</head>
<body>
  <h1>Welcome to My Webpage</h1>
  <p>This is a simple paragraph.</p>
  
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
    <li>List item 3</li>
  </ul>

  <a href="https://www.example.com">Visit Example.com</a>
</body>
</html>


This code will create a basic webpage with a heading, a paragraph, an unordered list, and a link to another website.`;
    } else if (userInput.includes('show me basic css codes')||(userInput.includes('show me basic css code'))) {
        response = `Here is an example of basic CSS code:

 Inline CSS:
html
<!DOCTYPE html>
<html>
<head>
  <title>Basic CSS Example</title>
</head>
<body>
  <h1 style="color: blue; text-align: center;">Welcome to My Webpage</h1>
  <p style="font-size: 16px; color: gray;">This is a simple paragraph with inline CSS.</p>
</body>
</html>


This code applies CSS directly to the HTML elements using the \`style\` attribute.


 Internal CSS:
html
<!DOCTYPE html>
<html>
<head>
  <title>Basic CSS Example</title>
  <style>
    body {
      background-color: lightyellow;
    }

    h1 {
      color: blue;
      text-align: center;
    }

    p {
      font-size: 16px;
      color: gray;
    }
  </style>
</head>
<body>
  <h1>Welcome to My Webpage</h1>
  <p>This is a simple paragraph styled with internal CSS.</p>
</body>
</html>


This example includes CSS within the \`<style>\` tag in the \`<head>\` section of the HTML document.


 External CSS:
HTML (index.html):
html
<!DOCTYPE html>
<html>
<head>
  <title>Basic CSS Example</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Welcome to My Webpage</h1>
  <p>This is a simple paragraph styled with external CSS.</p>
</body>
</html>


CSS (styles.css):
css
body {
  background-color: lightyellow;
}

h1 {
  color: blue;
  text-align: center;
}

p {
  font-size: 16px;
  color: gray;
}


In this case, the CSS code is stored in a separate \`styles.css\` file, and it's linked to the HTML file using the \`<link>\` tag.`;
 } else if (userInput.includes('what is agro alied industry')) {
     response = `Agro-allied industries are sectors of the economy that are directly linked to agriculture and farming. These industries process raw agricultural materials into finished products, enhance the value chain, and contribute to the overall agricultural and economic development. They bridge the gap between agricultural production and consumer markets by providing processing, manufacturing, and distribution services.
 
 Key Aspects of Agro-Allied Industries
 
 1.Processing
    -Definition: Transforming raw agricultural products into consumable goods or intermediate products.
    -Examples: Milling grains into flour, processing fruits into juices, and turning vegetables into canned products.
 
 2.Manufacturing
    -Definition: Producing products related to agriculture, including machinery and equipment.
    -Examples: Manufacturing tractors, plows, and irrigation systems.
 
 3.Packaging and Distribution
    -Definition: Packaging agricultural products for retail and managing their distribution to markets.
    -Examples: Packaging cereals, distributing fresh produce to supermarkets, and labeling processed foods.
 
 4.Biotechnology
    -Definition: Using biological processes for agricultural improvements and product development.
    -Examples: Developing genetically modified crops, creating bio-pesticides, and advancing soil fertility technologies.
 
 5.Retail and Consumer Goods
    -Definition: Selling agricultural products and processed goods directly to consumers.
    -Examples: Supermarkets, farmer's markets, and online grocery stores.
 
 Examples of Agro-Allied Industries
 
 1.Food Processing
    -Examples: Companies that process grains into flour, produce dairy products, or manufacture snacks and beverages.
 
 2.Textile Industry
    -Examples: Cotton processing mills, woolen garment manufacturers, and textile producers.
 
 3.Biofuel Production
    -Examples: Facilities that produce ethanol from corn or biodiesel from vegetable oils.
 
 4.Animal Feed Production
    -Examples: Companies that produce feed for poultry, livestock, and fish.
 
 5.Agricultural Machinery
    -Examples: Manufacturers of tractors, combine harvesters, and irrigation equipment.
 
 6.Fertilizer Production
    -Examples: Plants that produce synthetic or organic fertilizers used to enhance soil fertility.
 
 Importance of Agro-Allied Industries
 
 1.Economic Development: They contribute to economic growth by creating jobs, boosting agricultural productivity, and generating revenue.
 2.Value Addition: They add value to raw agricultural products, increasing their market value and providing higher income to farmers.
 3.Food Security: By processing and distributing food products, they help in ensuring food availability and reducing waste.
 4.Technological Advancements: They foster innovation in agricultural techniques and products through research and development.
 
 Challenges Facing Agro-Allied Industries
 
 1.Infrastructure: Limited infrastructure can hinder the efficient processing and distribution of agricultural products.
 2.Market Access: Small-scale producers may struggle to access larger markets due to competition and logistical challenges.
 3.Investment: High initial investment costs for technology and facilities can be a barrier for new entrants.
 4.Regulation and Compliance: Navigating regulatory requirements for food safety, quality standards, and environmental impact can be complex.
 
 Agro-allied industries play a crucial role in the agricultural sector by transforming raw products into valuable goods, supporting farmers, and contributing to overall economic growth.`;
 } else if (userInput.includes('what is agriculture')) {
     response = `Agriculture is the practice of cultivating the soil, growing crops, and raising animals for food, fiber, and other products used to sustain and enhance human life. It encompasses a wide range of activities including planting, harvesting, breeding animals, and managing resources like water and soil. Agriculture is crucial for producing the food we eat, the clothes we wear, and many other products essential to daily life. It also involves various practices and technologies to improve efficiency, sustainability, and productivity.`;
 } else if (userInput.includes('branches of agriculture')) {
     response = `Agriculture is a broad field with several specialized branches, each focusing on different aspects of farming, food production, and resource management. Here are some key branches:
 
 1. Crop Science: Focuses on growing plants for food, fiber, and other uses. It includes agronomy (study of crops and soils), horticulture (growing fruits, vegetables, and ornamental plants), and plant breeding.
 
 2. Animal Science: Concerned with the breeding, nutrition, and management of livestock and poultry. This branch includes veterinary science, animal husbandry, and dairy science.
 
 3. Soil Science: Studies soil as a natural resource, including its formation, classification, and mapping. It also focuses on soil fertility, conservation, and its role in supporting plant growth.
 
 4. Agricultural Engineering: Applies engineering principles to improve farming equipment, irrigation systems, and infrastructure. It also includes the design of efficient and sustainable farming systems.
 
 5. Agronomy: Focuses on crop production and soil management. It includes research on improving crop yields, pest management, and sustainable farming practices.
 
 6. Horticulture: Specializes in growing fruits, vegetables, nuts, seeds, herbs, sprouts, mushrooms, algae, and non-food crops like flowers and ornamental plants.
 
 7. Agricultural Economics: Analyzes the economic aspects of farming and food production, including market trends, policy impacts, and financial management.
 
 8. Plant Pathology: Studies plant diseases, their causes, and their effects on crops. It aims to develop methods for disease prevention and control.
 
 9. Entomology: The study of insects and their impact on crops and livestock. It includes pest management and the role of beneficial insects in agriculture.
 
 10. Food Science and Technology: Focuses on the processing, preservation, and safety of food. It includes studying food quality, nutrition, and packaging.
 
 11. Sustainable Agriculture: Emphasizes farming practices that maintain environmental health, economic profitability, and social equity. It includes organic farming, agroecology, and conservation agriculture.
 
 12. Forestry: Manages forests and woodlands for resources, conservation, and recreation. It involves tree planting, forest management, and ecosystem conservation.
 
 13. Aquaculture: The farming of aquatic organisms such as fish, crustaceans, and aquatic plants. It focuses on improving production techniques and managing aquatic environments.
 
 Each of these branches contributes to the overall goal of agriculture, which is to produce the resources needed to sustain human populations while balancing environmental and economic factors.`;
 
 
 } else if (userInput.includes('define biology') ||(userInput.includes('what is biology'))) {
     response = `Biology is the scientific study of life and living organisms. It encompasses various aspects of life, including structure, function, growth, evolution, distribution, and taxonomy. Biology aims to understand the fundamental principles governing the behavior and interactions of living organisms, from the molecular level to ecosystems.
 
 Key areas of study within biology include:
 
 1.Cell Biology: Examines the structure and function of cells, including cellular processes and interactions.
 2.Genetics: Focuses on heredity, gene function, and genetic variation in organisms.
 3.Evolution: Studies the origins and changes in species over time through natural selection and other mechanisms.
 4.Ecology: Investigates the relationships between organisms and their environments, including ecosystems and biomes.
 5.Physiology: Explores the functions and processes of living organisms and their systems.
 6.Anatomy: Analyzes the physical structures of organisms and their components.
 7.Microbiology: Studies microorganisms, such as bacteria, viruses, and fungi, and their roles in various environments.
 8.Botany: Focuses on plants, including their physiology, structure, and ecology.
 9.Zoology: Examines animals, their behaviors, physiology, and interactions with their environments.`;
 } else if (userInput.includes('write short note on velocity')) {
     response = `
         Velocity
 
 Velocity is a fundamental concept in physics that describes the rate at which an object changes its position. Unlike speed, which only measures how fast an object is moving, velocity is a vector quantity. This means it has both magnitude and direction. For example, if a car is traveling at 60 kilometers per hour to the north, its velocity is not just 60 km/h, but 60 km/h north.
 
 Velocity is crucial for understanding motion in both linear and rotational contexts. It helps us determine how quickly an object's position is changing and in what direction. In mathematical terms, velocity is often expressed as the derivative of position with respect to time or as the change in position divided by the change in time.
 
 In everyday life, velocity is used to describe not only how fast something is moving but also where it is headed. This makes it an essential concept in various fields such as engineering, navigation, and sports, where understanding both the speed and direction of movement is key to analyzing and predicting outcomes.`;
 
 }else if (userInput.includes('define physics')||(userInput.includes('what is physics'))){
     response = `Physics is the branch of science that studies matter, energy, and the fundamental forces of nature. It seeks to understand the behavior of the universe, from the smallest subatomic particles to the largest galaxies. Physics explores concepts such as motion, force, energy, heat, light, electricity, magnetism, and the structure of atoms.`
 
 }else if (userInput.includes('what is chemistry') ||(userInput.includes('define chemistry'))){
     response = `Chemistry is the branch of science that studies the composition, structure, properties, and changes of matter. It explores how substances interact, combine, and transform into different substances, forming the basis for understanding the natural world.`
 } else if (userInput.includes('what is a pronoun')||(userInput.includes('define pronoun'))) {
     response = 'A pronoun is a word that replaces a noun in a sentence to avoid repetition and simplify communication. Pronouns can refer to people, places, things, or ideas and can take various forms based on their grammatical function..';    
 } else if (userInput.includes('types of pronoun') || (userInput.includes('list the types of pronoun we have'))) {
     response = '1.Personal Pronouns: Refer to specific persons or things.2.Possessive Pronouns: Indicate ownership. 3.Reflexive Pronouns: Refer back to the subject of the sentence. 4.Demonstrative Pronouns: Point to specific things or people.Examples: this, that, these, those. 5.Interrogative Pronouns: Used to ask questions.Examples: who, whom, whose, what, which. 6.Relative Pronouns: Introduce relative clauses and connect them to nouns.Examples: who, whom, whose, which, that. 7.Indefinite Pronouns: Refer to non-specific persons or things';        
 } else if (userInput.includes('types of noun') || (userInput.includes('list the type of noun we have'))) {
     response = `1.Common Nouns: These are general names for a person, place, thing, or idea. They are not capitalized unless they begin a sentence.
     Examples: book, city, dog, happiness
     2.Proper Nouns: These are specific names for a particular person, place, thing, or idea and are always capitalized.
     Examples: John, Paris, Microsoft, Titanic.
     3.Concrete Nouns: These name things that can be seen, touched, heard, smelled, or tasted.
     Examples: apple, dog, music, perfume.
     4.Abstract Nouns: These name ideas, qualities, or states that cannot be seen or touched.
     Examples: love, freedom, intelligence, courage.
     5.Collective Nouns: These name groups or collections of people, animals, or things.
     Examples: team, flock, bunch, committee. 6.Countable Nouns: These are nouns that can be counted, and they have both singular and plural forms.Examples: car/cars, child/children, apple/apples. 7.Uncountable Nouns: These are nouns that cannot be counted individually and do not have a plural form.Examples: water, sugar, information, furniture. 8.Compound Nouns: These are nouns made up of two or more words, which can be written as one word, hyphenated, or as separate words.Compound Nouns: These are nouns made up of two or more words, which can be written as one word, hyphenated, or as separate words.Examples: toothpaste, mother-in-law, swimming pool.`;
 } else if (userInput.includes('crack a joke')  ||(userInput.includes('crack joke'))) {
     response = 'Why don’t scientists trust atoms Because they make up everything!';
 } else if (userInput.includes('can you help me')) {
     response = 'Sure! I can help you with your questions. Just ask!';
    } else if (userInput.includes('what is mountain')) {
        response = `A mountain is a large landform that rises prominently above its surroundings, typically having a peak or summit. Mountains are formed through various geological processes, including tectonic forces, volcanic activity, and erosion. They are characterized by steep slopes, significant height differences relative to the surrounding terrain, and often have a rugged appearance.`;
    } else if (userInput.includes('what is afforestation')) {
        response = `Afforestation is the process of planting trees and establishing forests in areas where there were no previous forests or where the land has not been forested for a long time. It is often undertaken to create new forests, improve biodiversity, restore degraded land, and combat desertification.`;
    } else if (userInput.includes('what is deforestation')) {
        response = `Deforestation is the large-scale removal or clearing of forests, often resulting in damage to the land and the loss of biodiversity. This process usually involves cutting down trees for timber, converting forest land into agricultural fields, urban development, or mining.`;
    } else if (userInput.includes('characteristics of moutain')) {
        response = `Key Characteristics:
Elevation: Mountains generally have significant height, often rising hundreds or thousands of meters above sea level.
Formation: Mountains are commonly formed by the collision of tectonic plates (fold mountains), volcanic activity (volcanic mountains), or the uplift of land due to geological forces (block mountains).
Climate: Mountainous regions often have cooler temperatures and different weather patterns compared to lower elevations, with snow-capped peaks common in high mountains.
Examples:
Mount Everest: The highest mountain in the world, located in the Himalayas.
Rocky Mountains: A major mountain range in North America.
Mount Fuji: A famous volcanic mountain in Japan.`;
    } else if (userInput.includes('causes of deforestation')) {
        response = `Agricultural Expansion: Forests are often cleared to create space for crops, livestock, or plantations.
Logging: Trees are cut down for timber, paper production, and other wood products.
Infrastructure Development: Building roads, cities, and other infrastructure leads to the destruction of forests.
Mining: Extraction of minerals and resources often involves clearing forested areas.`;
    } else if (userInput.includes('consequences of deforestation')) {
        response = `Environmental Degradation: Loss of habitat for wildlife, soil erosion, disruption of water cycles, and decreased biodiversity.
Climate Change: Deforestation contributes to climate change by reducing the number of trees that can absorb carbon dioxide, leading to higher concentrations of greenhouse gases in the atmosphere.
Loss of Livelihoods: Indigenous and local communities that depend on forests for their livelihoods are often adversely affected.`;
    } else if (userInput.includes('benefit of afforestation') ||(userInput.includes('import of afforestation'))) {
        response = `Key Purposes:
Environmental Conservation: Afforestation helps in soil conservation, preventing erosion, and improving water retention in the soil.
Carbon Sequestration: Trees absorb carbon dioxide from the atmosphere, helping to mitigate climate change by reducing the concentration of greenhouse gases.
Biodiversity: Establishing new forests provides habitats for various plant and animal species, promoting biodiversity.
Benefits:
Economic: Timber production, non-timber forest products, and eco-tourism.
Social: Improved air quality, recreational spaces, and enhanced aesthetics of the environment.`;
    } else if (userInput.includes('what is rock')) {
        response = `A rock is a naturally occurring solid mass or aggregate of minerals and/or mineraloids. Rocks are the building blocks of the Earth's crust and are classified into three major types based on their formation processes: igneous, sedimentary, and metamorphic.`;
    } else if (userInput.includes('types of rock')) {
        response = `Types of Rocks:
Igneous Rocks:

Formation: Formed from the cooling and solidification of molten rock (magma or lava).
Examples:
Granite: A coarse-grained igneous rock often used in construction.
Basalt: A fine-grained volcanic rock that makes up much of the ocean floor.
Sedimentary Rocks:

Formation: Formed from the accumulation, compaction, and cementation of sediments (particles of rock, minerals, and organic material) over time.
Examples:
Limestone: A rock composed mainly of calcium carbonate, often formed from marine organisms.
Sandstone: Formed from compacted sand particles, commonly found in layers.
Metamorphic Rocks:

Formation: Formed from the transformation of existing rock types (igneous, sedimentary, or even other metamorphic rocks) due to high pressure, high temperature, or chemically active fluids.
Examples:
Marble: Formed from limestone undergoing metamorphism, often used in sculpture and architecture.
Slate: Formed from shale, known for its ability to be split into thin sheets.`;
    } else if (userInput.includes('characteristics of rocks')) {
        response = `Composition: Rocks are composed of one or more minerals. For example, granite is composed of quartz, feldspar, and mica.
Texture: The size, shape, and arrangement of the minerals within a rock give it its texture, which can range from fine-grained (small crystals) to coarse-grained (large crystals).
Color: The color of a rock depends on its mineral composition. For example, basalt is typically dark, while limestone is often light-colored.
Hardness: Rocks can vary in hardness, depending on the minerals they contain. For instance, diamond, found in some metamorphic rocks, is the hardest known natural material.`;
    } else if (userInput.includes('uses of rocks')) {
        response = `Construction: Rocks like granite, limestone, and marble are widely used in construction and building materials.
Industry: Certain rocks are valuable resources for the extraction of minerals, such as iron ore (hematite) or copper ore (chalcopyrite).
Art and Culture: Rocks like marble and slate have been used historically for sculptures, monuments, and various cultural artifacts.`;
    } else if (userInput.includes('geological significance')) {
        response = `Earth's History: Rocks provide important clues about the Earth's history, including the conditions under which they formed, the processes that shaped them, and the environments they were exposed to.
Natural Processes: The rock cycle describes how rocks are continuously transformed from one type to another through processes like melting, cooling, erosion, deposition, and metamorphism.`;
    } else if (userInput.includes('give me the characteristics of every planet') ||(userInput.includes('give me the characteristics of all planet'))) {
        response = `Each planet in our solar system has unique characteristics that distinguish it from the others. Here's an overview of the key features of all eight planets:

1. Mercury
   - Position: Closest planet to the Sun.
   - Size: Smallest planet in the solar system.
   - Surface: Rocky, heavily cratered, and similar in appearance to the Moon.
   - Temperature: Extreme temperature fluctuations, ranging from -173°C at night to 427°C during the day.
   - Atmosphere: Very thin, composed mainly of oxygen, sodium, and hydrogen.
   - Moons: None.

2. Venus
   - Position: Second planet from the Sun.
   - Size: Similar in size and structure to Earth, often called Earth's "sister planet."
   - Surface: Volcanic and rocky, with mountains, valleys, and large lava plains.
   - Temperature: Hottest planet in the solar system, with surface temperatures around 465°C due to a runaway greenhouse effect.
   - Atmosphere: Thick, composed mainly of carbon dioxide with clouds of sulfuric acid, leading to intense atmospheric pressure.
   - Moons: None.
   - Rotation: Rotates in the opposite direction of most planets (retrograde rotation).

3. Earth
   - Position: Third planet from the Sun.
   - Size: Fifth-largest planet in the solar system.
   - Surface: 71% covered by water, with diverse landscapes including mountains, plains, deserts, and forests.
   - Temperature: Moderate, supporting a wide range of life forms.
   - Atmosphere: Composed mainly of nitrogen (78%) and oxygen (21%), with trace amounts of other gases.
   - Moons: One (the Moon).
   - Life: The only known planet to support life.

4. Mars
   - Position: Fourth planet from the Sun.
   - Size: About half the size of Earth.
   - Surface: Rocky, with the largest volcano (Olympus Mons) and canyon (Valles Marineris) in the solar system.
   - Temperature: Cold, with an average surface temperature of around -60°C.
   - Atmosphere: Thin, composed mostly of carbon dioxide, with traces of nitrogen and argon.
   - Moons: Two (Phobos and Deimos).
   - Exploration: Subject of many exploration missions due to the possibility of past water and life.

5. Jupiter
   - Position: Fifth planet from the Sun.
   - Size: Largest planet in the solar system.
   - Surface: Gas giant with no solid surface; characterized by bands of clouds and the Great Red Spot, a massive storm.
   - Temperature: Very cold, with cloud tops around -145°C.
   - Atmosphere: Composed mainly of hydrogen (90%) and helium (10%), with trace amounts of other gases.
   - Moons: 92 confirmed moons, including the largest moon in the solar system, Ganymede.
   - Rings: Faint ring system composed of dust particles.

6. Saturn
   - Position: Sixth planet from the Sun.
   - Size: Second-largest planet in the solar system.
   - Surface: Gas giant with no solid surface; known for its extensive and bright ring system.
   - Temperature: Cold, with cloud tops around -178°C.
   - Atmosphere: Composed mainly of hydrogen and helium.
   - Moons: 146 confirmed moons, including Titan, which has a thick atmosphere and liquid methane lakes.
   - Rings: Most prominent and complex ring system in the solar system, made of ice and rock particles.

7. Uranus
   - Position: Seventh planet from the Sun.
   - Size: Third-largest planet by diameter.
   - Surface: Ice giant with a possible rocky core surrounded by water, ammonia, and methane ices.
   - Temperature: Extremely cold, with an average temperature around -224°C.
   - Atmosphere: Composed mainly of hydrogen, helium, and methane, which gives the planet its blue-green color.
   - Moons: 27 confirmed moons.
   - Rings: Faint rings composed of dark particles.
   - Tilt: Unusual axial tilt of about 98 degrees, causing it to rotate on its side.

8. Neptune
   - Position: Eighth and farthest known planet from the Sun.
   - Size: Fourth-largest planet by diameter.
   - Surface: Ice giant similar to Uranus, with a possible rocky core surrounded by water, ammonia, and methane ices.
   - Temperature: Extremely cold, with cloud tops around -214°C.
   - Atmosphere: Composed mainly of hydrogen, helium, and methane, with dynamic weather and the fastest winds in the solar system.
   - Moons: 14 confirmed moons, including Triton, which has geysers and a retrograde orbit.
   - Rings: Faint ring system composed of dust particles and ice.

Summary:
Each planet in our solar system has its own unique set of characteristics, ranging from the rocky surfaces of the inner planets (Mercury, Venus, Earth, Mars) to the gas and ice giants of the outer solar system (Jupiter, Saturn, Uranus, Neptune). These characteristics include differences in size, atmosphere, temperature, surface conditions, and the presence of moons and rings.`;

}else if (userInput.includes('fold mountains')) {
    response = `Fold mountains are formed by the collision of two tectonic plates. This collision causes the Earth's crust to fold and create mountain ranges such as the Himalayas.`;
} else if (userInput.includes('fault-block mountains')) {
    response = `Fault-block mountains are created by faulting in the Earth's crust. Blocks of rock are either uplifted or dropped, forming mountains like the Sierra Nevada.`;
} else if (userInput.includes('volcanic mountains')) {
    response = `Volcanic mountains are formed by volcanic activity. Magma rises to the Earth's surface and creates mountains around the volcano, such as Mount Fuji.`;
} else if (userInput.includes('residual mountains')) {
    response = `Residual mountains are the remnants of ancient mountains that have been worn down by erosion. Examples include the Appalachian Mountains.`;

 } else if (userInput.includes('what is favorite color')) {
     response = 'As a AI, I don’t have favorites, but I like the color of the sky!';
    } else if (userInput.includes('types of savanna')) {
        response =`savanna are devided into many types, namely:
        Sudan savanna.
        Sahel savanna.
        Mangrove savanna.
        Rain forest etc.`;
 }else if (userInput.includes('mercury')) {
        response = `Mercury is the smallest planet in our solar system and the closest to the Sun. It has extreme temperature fluctuations, with scorching days and freezing nights.`;
    } else if (userInput.includes('venus')) {
        response = `Venus is similar in size to Earth but has a thick, toxic atmosphere composed mainly of carbon dioxide. It's the hottest planet due to its runaway greenhouse effect.`;
    } else if (userInput.includes('earth')) {
        response = `Earth is the only planet known to support life. It has a diverse climate, and its surface is 71% water, which exists in all three states: solid, liquid, and gas.`;
    } else if (userInput.includes('mars')) {
        response = `Mars is known as the Red Planet due to its reddish appearance. It has the tallest volcano and the largest canyon in the solar system, and it may have had water in the past.`;
    } else if (userInput.includes('jupiter')) {
        response = `Jupiter is the largest planet in our solar system. It's a gas giant with a strong magnetic field and at least 79 moons, including the largest moon, Ganymede.`;
    } else if (userInput.includes('saturn')) {
        response = `Saturn is famous for its beautiful ring system, which is made up of ice and rock particles. It's another gas giant, with a similar composition to Jupiter.`;
    } else if (userInput.includes('uranus')) {
        response = `Uranus is an ice giant with a blue-green color due to methane in its atmosphere. It rotates on its side, making its seasons extreme and unusual.`;
    } else if (userInput.includes('neptune')) {
        response = `Neptune is the farthest planet from the Sun and is known for its deep blue color. It's a windy ice giant with a storm called the Great Dark Spot.`;
 } else if (userInput.includes('what is the time')||(userInput.includes('what is the current time'))) {
     response = `The current time is ${new Date().toLocaleTimeString()}.`;
 } else if (userInput.includes('what is the date') ||userInput.includes('what is today\'s date')) {
     response = `Today's date is ${new Date().toLocaleDateString()}.`;
 } else if (userInput.includes('what is the unit of force') || (userInput.includes('define the unit of force'))) {
     response = 'The speed of light is approximately 3.00 x 10^8 meters per second.';
 } else if (userInput.includes('define momentum') || (userInput.includes('what is momentum'))) {
     response = 'Momentum is the product of an object\'s mass and its velocity.';
 }else if (userInput.includes('what is the periodic table')|| (userInput.includes('define periodic table'))){
     response = `The periodic table is a tabular arrangement of chemical elements based on their atomic number.`;
 } else if (userInput.includes('what is industry')) {
     response = `An industry is a group of businesses or organizations that produce, manage, and deliver goods or services within a specific sector of the economy. Industries are categorized based on their primary activities, products, or services. They play a crucial role in the economic structure by contributing to economic growth, creating jobs, and facilitating trade and innovation.
 
  Key Characteristics of an Industry:
 
 1.Production and Manufacturing:
    -Activities: Industries involve the production and manufacturing of goods, ranging from raw materials to finished products.
    -Examples: Automotive industry (produces cars), textile industry (produces fabrics and clothing).
 
 2.Service Provision:
    -Activities: Some industries focus on providing services rather than physical products.
    -Examples: Hospitality industry (provides lodging and dining services), healthcare industry (provides medical services).
 
 3.Economic Contribution:
    -Role: Industries contribute significantly to the gross domestic product (GDP) of a country and are vital for economic development.
    -Examples: Technology industry contributing to innovation and productivity, tourism industry contributing to foreign exchange earnings.
 
 4.Employment:
    -Role: Industries create job opportunities for a large number of people, driving employment and skill development.
    -Examples: Construction industry employing builders and engineers, education industry employing teachers and administrative staff.
 
 5.Trade and Commerce:
    -Role: Industries facilitate domestic and international trade by producing goods and services that are bought and sold in the market.
    -Examples: Exporting electronics from the tech industry, importing oil for the energy industry.
 
  Types of Industries:
 
 1.Primary Industries:
    -Definition: These industries involve the extraction and production of raw materials from the natural environment.
    -Examples: Agriculture, mining, fishing, forestry.
 
 2.Secondary Industries:
    -Definition: These industries involve the manufacturing and processing of raw materials into finished goods.
    -Examples: Manufacturing, construction, food processing.
 
 3.Tertiary Industries:
    -Definition: These industries provide services rather than goods.
    -Examples: Retail, finance, healthcare, education, entertainment.
 
 4.Quaternary Industries:
    -Definition: These industries involve the processing and distribution of information and knowledge.
    -Examples: Information technology, research and development, consultancy.
 
 5.Quinary Industries:
    -Definition: These industries focus on high-level decision-making and advanced services.
    -Examples: Government, scientific research, high-level management in businesses.
 
  Importance of Industries:
 
 -Economic Growth: Industries drive economic growth by increasing production, enhancing productivity, and creating wealth.
 -Job Creation: They provide employment opportunities, which in turn support livelihoods and reduce poverty.
 -Technological Advancement: Industries foster innovation and technological advancements through research and development.
 -Global Trade: Industries facilitate international trade and globalization by producing goods and services that are exchanged globally.
 -Infrastructure Development: Industrial growth leads to the development of infrastructure such as roads, ports, and communication networks.
 
  Challenges Facing Industries:
 
 -Environmental Impact: Industrial activities can lead to pollution, resource depletion, and environmental degradation.
 -Economic Fluctuations: Industries are susceptible to economic cycles, market demand changes, and financial crises.
 -Regulatory Compliance: Industries must navigate complex regulations and compliance requirements, which can impact operations.
 -Technological Disruption: Rapid technological changes can render existing processes and products obsolete, requiring continual adaptation.
 
 In summary, an industry is a vital component of the economy, encompassing various activities that produce goods and services. It plays a significant role in economic development, job creation, and technological progress, while also facing challenges that require careful management and innovation.`;
 } else if (userInput.includes(' what are those challenges facing industries:')) {
     response = `Environmental Impact: Industrial activities can lead to pollution, resource depletion, and environmental degradation.
 Economic Fluctuations: Industries are susceptible to economic cycles, market demand changes, and financial crises.
 Regulatory Compliance: Industries must navigate complex regulations and compliance requirements, which can impact operations.
 Technological Disruption: Rapid technological changes can render existing processes and products obsolete, requiring continual adaptation.`;
 } else if (userInput.includes('define geography ')|| (userInput.includes('what is geography '))) {
     response = `Geography is the scientific study of the Earth's lands, features, inhabitants, and phenomena. It involves the analysis of spatial and temporal patterns and the understanding of the physical and human processes that shape the world's landscapes and environments.
     Geography uses various tools and methods, such as maps, geographic information systems (GIS), remote sensing, and spatial analysis, to gather, analyze, and interpret geographic data. The discipline aims to understand the complexities of our world and to address issues related to the environment, urban development, globalization, and sustainable resource management.`;
 } else if (userInput.includes('branches of biology')|| (userInput.includes('list the branches of biology'))) {
     response = `Biology is a broad and diverse field with many specialized branches. Here are some of the primary branches of biology:
 
 1. Botany: The study of plants, including their physiology, structure, genetics, ecology, distribution, classification, and economic importance.
 
 2. Zoology: The study of animals, including their biology, behavior, physiology, classification, and distribution.
 
 3. Microbiology: The study of microorganisms, such as bacteria, viruses, fungi, and protozoa, including their physiology, classification, and interactions with other organisms and the environment.
 
 4. Genetics: The study of genes, heredity, and genetic variation in living organisms, focusing on how traits are passed from one generation to the next.
 
 5. Ecology: The study of the relationships between living organisms and their environment, including the interactions among organisms and between organisms and their physical surroundings.
 
 6. Evolutionary Biology: The study of the origins and changes in the diversity of life over time, focusing on the processes that drive the evolution of species and populations.
 
 7. Cell Biology: The study of the structure, function, and behavior of cells, which are the basic units of life.
 
 8. Molecular Biology: The study of the molecular basis of biological activity, including the interactions between various systems of a cell, such as DNA, RNA, and protein synthesis.
 
 9. Physiology: The study of the normal functions of living organisms and their parts, including how organisms, organ systems, organs, cells, and biomolecules carry out chemical and physical functions.
 
 10. Anatomy: The study of the structure of living organisms, including their systems, organs, and tissues.
 
 11. Biochemistry: The study of the chemical processes and substances that occur within living organisms.
 
 12. Biophysics: The application of the principles and methods of physics to understand how biological systems work.
 
 13. Marine Biology: The study of organisms in the ocean and other saltwater environments, including their behavior, physiology, and ecology.
 
 14. Immunology: The study of the immune system, including how the body defends itself against disease-causing agents.
 
 15. Neuroscience: The study of the nervous system, including the brain, spinal cord, and networks of sensory nerve cells.
 
 16. Developmental Biology: The study of the processes by which organisms grow and develop, from fertilization to adult form.
 
 17. Entomology: The study of insects, including their biology, behavior, and impact on ecosystems and human activities.
 
 18. Parasitology: The study of parasites and their interactions with host organisms.
 
 19. Virology: The study of viruses and viral diseases.
 
 20. Mycology: The study of fungi, including their genetic and biochemical properties, taxonomy, and use to humans.
 
 21. Paleontology: The study of the history of life on Earth through the examination of plant and animal fossils.
 
 22. Ethology: The study of animal behavior, particularly in natural environments.
 
 23. Biotechnology: The use of living systems and organisms to develop or make products, often involving genetic manipulation.
 
 24. Astrobiology: The study of the potential for life elsewhere in the universe, including the origins and evolution of life on Earth.
 
 25. Ornithology: The study of birds, including their behavior, ecology, and physiology.
 
 These branches often overlap and interconnect, leading to interdisciplinary fields that address complex biological questions and challenges.`;
 } else if (userInput.includes('branches of geography')|| (userInput.includes('list the branches of geography'))) {
     response = `Geography is broadly divided into two main branches:
 
 1.Physical Geography: This branch focuses on the natural environment, including the study of landforms, climates, vegetation, soils, and hydrology. It examines the processes that create and modify the Earth's physical features and investigates how these features interact with one another.
 
 2.Human Geography: This branch studies the spatial aspects of human existence. It looks at how human activities, cultures, economies, and societies are organized and distributed across the Earth's surface. It also explores the relationships between people and their environments and how these interactions shape the world.`;
 } else if (userInput.includes('branches of chemistry')|| (userInput.includes('list the branches of chemistry'))) {
     response = `A degree in chemistry opens up a wide array of career opportunities in various fields. Here are some career prospects in chemistry:
 
 1. Research and Development
 - Pharmaceuticals: Developing new drugs and medical treatments.
 - Materials Science: Creating new materials with specific properties for use in technology, construction, and manufacturing.
 - Environmental Chemistry: Studying pollutants and developing methods to reduce environmental impact.
 
 2. Chemical Engineering
 - Process Engineering: Designing and optimizing processes for large-scale chemical manufacturing.
 - Product Development: Creating new chemical products, such as polymers, fuels, and lubricants.
 
 3. Healthcare and Pharmaceuticals
 - Clinical Chemistry: Working in laboratories to analyze bodily fluids and assist in diagnosing diseases.
 - Toxicology: Studying the effects of chemicals on human health and the environment.
 - Regulatory Affairs: Ensuring that products comply with regulations and standards.
 
 4. Education
 - Teaching: Teaching chemistry at the high school or college level.
 - Academic Research: Conducting research in universities and teaching at the same time.
 
 5. Quality Control and Assurance
 - Quality Control Chemist: Testing materials and products to ensure they meet quality standards.
 - Quality Assurance Manager: Overseeing the processes to maintain product quality and safety.
 
 6. Environmental Science
 - Environmental Consultant: Advising on the chemical impact of industrial activities on the environment.
 - Environmental Scientist: Conducting research to understand and mitigate environmental issues.
 
 7. Forensic Science
 - Forensic Chemist: Analyzing chemical evidence in criminal investigations.
 - Toxicologist: Examining biological samples for the presence of drugs, toxins, and other chemicals.
 
 8. Industrial and Manufacturing
 - Production Chemist: Overseeing the chemical production processes in industries.
 - Safety Specialist: Ensuring safe handling and disposal of chemicals in industrial settings.
 
 9. Sales and Marketing
 - Technical Sales Representative: Selling chemical products and providing technical support to customers.
 - Product Manager: Overseeing the development and marketing of chemical products.
 
 10. Government and Policy
 - Regulatory Scientist: Working with government agencies to develop and enforce regulations related to chemicals.
 - Policy Advisor: Advising on policies related to chemical safety and environmental protection.
 
 11. Cosmetics and Personal Care
 - Cosmetic Chemist: Developing and testing new cosmetic and personal care products.
 - Formulation Chemist: Creating new formulas for beauty and skincare products.
 
 12. Food and Beverage
 - Food Chemist: Analyzing food products for quality, safety, and nutritional content.
 - Flavor Chemist: Creating and testing new flavors for food and beverages.
 
 Skills and Qualifications:
 To pursue a career in chemistry, individuals typically need a strong background in chemistry and related sciences, often requiring at least a bachelor's degree in chemistry or a related field. Advanced positions may require a master's degree or Ph.D. Additionally, practical laboratory skills, analytical thinking, problem-solving abilities, and knowledge of industry-specific regulations are highly valuable.
 
 Professional Development:
 Joining professional organizations, such as the American Chemical Society (ACS) or the Royal Society of Chemistry (RSC), can provide networking opportunities, access to industry publications, and ongoing education to stay current with advancements in the field.`;
 } else if (userInput.includes('what is computer')|| (userInput.includes('what is a computer'))) {
     response = `
 A computer is an electronic device that processes data according to a set of instructions, or a program, to perform a wide range of tasks. It can store, retrieve, and manipulate data, enabling it to perform various functions from basic calculations to complex simulations.`;
 }else if(userInput.includes('what are some key component in computer')||(userInput.includes('what are the key component in computer'))){
     response = ` Key Components:
 
 1. Central Processing Unit (CPU):
 - Often referred to as the "brain" of the computer, the CPU performs most of the processing inside a computer. It executes instructions from programs through basic arithmetic, logical operations, control, and input/output operations.
 
 2. Memory (RAM):
 - Random Access Memory (RAM) is the computer's short-term memory, used to store data that is actively being worked on. It allows for quick access and manipulation of data by the CPU.
 
 3. Storage:
 - Long-term storage devices, such as hard drives (HDDs) and solid-state drives (SSDs), store data and programs permanently until they are deleted or modified by the user.
 
 4. Motherboard:
 - The main circuit board that connects all components of the computer, allowing them to communicate with each other.
 
 5. Input Devices:
 - Devices such as keyboards, mice, and scanners that allow the user to interact with the computer and input data.
 
 6. Output Devices:
 - Devices such as monitors, printers, and speakers that allow the computer to communicate information to the user.
 
 7. Operating System (OS):
 - Software that manages the computer's hardware and software resources, providing services for computer programs. Examples include Windows, macOS, Linux, and Android.
 
 Types of Computers:
 
 1. Personal Computers (PCs):
 - General-purpose computers designed for individual use. They include desktops, laptops, and tablets.
 
 2. Servers:
 - Powerful computers designed to manage network resources and provide services to other computers in a network.
 
 3. Supercomputers:
 - Extremely powerful computers used for complex scientific calculations and simulations.
 
 4. Embedded Systems:
 - Computers integrated into other devices to perform specific control functions, such as in cars, appliances, and medical devices.
 
 5. Mainframes:
 - Large, powerful computers used by large organizations for bulk data processing and critical applications.
 
 Functions of a Computer:
 
 1. Data Processing:
 - Performing calculations, data sorting, data storage, and data retrieval.
 
 2. Automation:
 - Automating repetitive tasks, such as data entry, payroll processing, and manufacturing control.
 
 3. Communication:
 - Facilitating communication through email, video conferencing, and social media.
 
 4. Entertainment:
 - Playing games, streaming music and videos, and creating multimedia content.
 
 5. Information Storage and Retrieval:
 - Storing vast amounts of information and providing easy access to it when needed.
 
 How Computers Work:
 
 1. Input:
 - Data is entered into the computer through input devices.
 
 2. Processing:
 - The CPU processes`;
 }else if (userInput.includes('what is the full meaning of LED')|| (userInput.includes('define led in physics'))||(userInput.includes('what is led'))){
     response = `LED stands for "Light Emitting Diode." It is a type of semiconductor device that emits light when an electric current passes through it. LEDs are widely used for their energy efficiency, long lifespan, and versatility in various applications, including lighting, displays, and indicators."`;
 } else if (userInput.includes('state the law of universal gravitation')) {
     response = `Every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers.`;
 
 } else if (userInput.includes('what is the law of conservation of mass')) {
     response = `The Law of Conservation of Mass and the Law of Conservation of Energy are fundamental principles in physics and chemistry that describe the behavior of mass and energy in a closed system.
 
 Law of Conservation of Mass
 The Law of Conservation of Mass states that mass is neither created nor destroyed in a chemical reaction. This means that the total mass of the reactants in a chemical reaction is equal to the total mass of the products.
 
 Mathematically:
 
 Total mass of reactants =Total mass of products
 
 Implication: During any chemical process, the amount of matter remains constant, though it may change forms.`;
 } else if (userInput.includes('state the law of conservation of energy')) {
     response = `Law of Conservation of Energy
 The Law of Conservation of Energy states that energy cannot be created or destroyed, only transformed from one form to another. The total amount of energy in a closed system remains constant over time.
 
 Mathematically:
 
 Total energy initial
 =
 Total energy final
 Total energy initial=Total energy final
 
 Forms of Energy: Energy can exist in various forms, such as kinetic energy, potential energy, thermal energy, chemical energy, and more. In any process, the sum of these energies remains constant, though energy may change from one form to another.`;
 } else if (userInput.includes('combined implications in chemical reactions of mass and enery')) {
     response = `Conservation of Mass: During a chemical reaction, the mass of the reactants equals the mass of the products. Atoms are rearranged but not created or destroyed.
 Conservation of Energy: The energy required to break bonds in the reactants is balanced by the energy released when new bonds form in the products. Energy might change forms (e.g., chemical energy to thermal energy), but the total amount remains the same.
 Examples
 Combustion of Methane:
 
 Mass Conservation: The mass of methane and oxygen before combustion equals the mass of carbon dioxide and water produced.
 Energy Conservation: The chemical energy stored in methane and oxygen is converted to thermal energy and light energy, but the total energy remains constant.
 Physical Changes:
 
 Melting Ice: When ice melts, the mass of the water is the same as the mass of the ice. The thermal energy added to melt the ice increases the kinetic energy of the water molecules, but no energy is lost or gained overall.
 These principles are foundational in understanding physical and chemical processes and are applied universally in scientific studies and practical applications.`;
 } else if (userInput.includes('state boyle\'s law')) {
     response = `Boyle's Law states that the pressure of a given mass of gas is inversely proportional to its volume, provided the temperature remains constant.
 
 Mathematically:
 𝑃1𝑉1 = 𝑃2𝑉2
 
 Where:
 
 𝑃  is the pressure
 𝑉  is the volume`;
 } else if (userInput.includes('state Charle\'s law')) {
     response = `Charles's Law states that the volume of a given mass of gas is directly proportional to its temperature (in Kelvin), provided the pressure remains constant.
 
 Mathematically:
 𝑉1 = 𝑉2
 T1    𝑇2
 
 Where:
 
 𝑉
 V is the volume
 𝑇
 T is the temperature in Kelvin`;
 } else if (userInput.includes('state the general gas law')) {
     response = `The General Gas Law, or Combined Gas Law, combines Boyle's Law, Charles's Law, and Gay-Lussac's Law. It describes the relationship between pressure, volume, and temperature of a fixed amount of gas.
 Mathematically:
 𝑃1𝑉1 over T1 = 𝑃2𝑉2 over T2`;



} else if (userInput.includes('what is the most popular sport in the world')) {
    response = 'The most popular sport in the world is soccer (football).';
} else if (userInput.includes('what is the capital of germany')) {
    response = 'The capital of Germany is Berlin.';
} else if (userInput.includes('who is the founder of microsoft')) {
    response = 'Bill Gates is the founder of Microsoft.';
} else if (userInput.includes('what is the largest island in the world')) {
    response = 'The largest island in the world is Greenland.';
} else if (userInput.includes('what is the main language spoken in Brazil')) {
    response = 'The main language spoken in Brazil is Portuguese.';
} else if (userInput.includes('who invented the light bulb')) {
    response = 'Thomas Edison is credited with inventing the light bulb.';
} else if (userInput.includes('what is the name of the process by which plants make their food')) {
    response = 'The process by which plants make their food is called photosynthesis.';
} else if (userInput.includes('what is the most populous country in the world')) {
    response = 'The most populous country in the world is China.';
} else if (userInput.includes('what is the capital of italy')) {
    response = 'The capital of Italy is Rome.';
} else if (userInput.includes('who wrote the great gatsby')) {
    response = 'F. Scott Fitzgerald wrote The Great Gatsby.';
} else if (userInput.includes('what is the chemical symbol for sodium')) {
    response = 'The chemical symbol for sodium is Na.';
} else if (userInput.includes('what is the tallest waterfall in the world')) {
    response = 'The tallest waterfall in the world is Angel Falls in Venezuela.';
} else if (userInput.includes('who discovered america')) {
    response = 'Christopher Columbus is credited with discovering America in 1492.';
} else if (userInput.includes('what is the capital of india')) {
    response = 'The capital of India is New Delhi.';
} else if (userInput.includes('who was the first woman to win a Nobel Prize')) {
    response = 'Marie Curie was the first woman to win a Nobel Prize.';
} else if (userInput.includes('what is the most spoken language in South America')) {
    response = 'The most spoken language in South America is Spanish.';
} else if (userInput.includes('who painted the last supper')) {
    response = 'Leonardo da Vinci painted The Last Supper.';
} else if (userInput.includes('what is the smallest bone in the human body')) {
    response = 'The smallest bone in the human body is the stapes bone in the ear.';
} else if (userInput.includes('what is the largest volcano in the world')) {
    response = 'The largest volcano in the world is Mauna Loa in Hawaii.';
} else if (userInput.includes('what is the capital of egypt')) {
    response = 'The capital of Egypt is Cairo.';
} else if (userInput.includes('who is the famous scientist who developed the theory of relativity')) {
    response = 'Albert Einstein developed the theory of relativity.';
} else if (userInput.includes('what is the most abundant element in the universe')) {
    response = 'The most abundant element in the universe is hydrogen.';
} else if (userInput.includes('who is the author of the hobbit')) {
    response = 'J.R.R. Tolkien is the author of The Hobbit.';
} else if (userInput.includes('what is the chemical symbol for oxygen')) {
    response = 'The chemical symbol for oxygen is O.';
} else if (userInput.includes('what is the largest city in the United States')) {
    response = 'The largest city in the United States by population is New York City.';
} else if (userInput.includes('who invented the airplane')) {
    response = 'The Wright brothers, Orville and Wilbur Wright, invented the airplane.';
} else if (userInput.includes('what is the deepest part of the ocean')) {
    response = 'The deepest part of the ocean is the Mariana Trench.';
} else if (userInput.includes('what is the currency of japan')) {
    response = 'The currency of Japan is the Japanese Yen.';
} else if (userInput.includes('what is the capital of spain')) {
    response = 'The capital of Spain is Madrid.';
} else if (userInput.includes('who wrote the catcher in the rye')) {
    response = 'J.D. Salinger wrote The Catcher in the Rye.';
} else if (userInput.includes('what is the chemical symbol for carbon')) {
    response = 'The chemical symbol for carbon is C.';
} else if (userInput.includes('who was the first president of the united states')) {
    response = 'The first President of the United States was George Washington.';
} else if (userInput.includes('what is the highest mountain in Africa')) {
    response = 'The highest mountain in Africa is Mount Kilimanjaro.';
} else if (userInput.includes('who wrote the odyssey')) {
    response = 'Homer wrote The Odyssey.';
} else if (userInput.includes('what is the capital of brazil')) {
    response = 'The capital of Brazil is Brasília.';
} else if (userInput.includes('who was the 16th president of the united states')) {
    response = 'The 16th President of the United States was Abraham Lincoln.';
} else if (userInput.includes('what is the largest lake in the world')) {
    response = 'The largest lake in the world by surface area is the Caspian Sea.';
} else if (userInput.includes('what is the name of the closest star to Earth')) {
    response = 'The closest star to Earth is the Sun.';
} else if (userInput.includes('who wrote the divine comedy')) {
    response = 'Dante Alighieri wrote The Divine Comedy.';
} else if (userInput.includes('what is the most common gas in Earth\'s atmosphere')) {
    response = 'The most common gas in Earth\'s atmosphere is nitrogen.';
} else if (userInput.includes('who was the first woman to fly solo across the Atlantic Ocean')) {
    response = 'Amelia Earhart was the first woman to fly solo across the Atlantic Ocean.';
} else if (userInput.includes('what is the largest coral reef system in the world')) {
    response = 'The largest coral reef system in the world is the Great Barrier Reef.';
} else if (userInput.includes('what is the capital of portugal')) {
    response = 'The capital of Portugal is Lisbon.';
} else if (userInput.includes('who discovered gravity')) {
    response = 'Sir Isaac Newton is credited with the discovery of gravity.';
} else if (userInput.includes('what is the largest desert in the world')) {
    response = 'The largest desert in the world is the Antarctic Desert.';
} else if (userInput.includes('who is the current president of the united states')) {
    response = 'As of 2024, the current President of the United States is Joe Biden.';
} else if (userInput.includes('what is the smallest country in the world')) {
    response = 'The smallest country in the world is Vatican City.';
} else if (userInput.includes('who wrote the picture of dorian gray')) {
    response = 'Oscar Wilde wrote The Picture of Dorian Gray.';
} else if (userInput.includes('what is the most distant planet in our solar system')) {
    response = 'The most distant planet in our solar system is Neptune.';
} else if (userInput.includes('who is known as the father of modern physics')) {
    response = 'Albert Einstein is known as the father of modern physics.';
} else if (userInput.includes('what is the capital of canada')) {
    response = 'The capital of Canada is Ottawa.';
} else if (userInput.includes('who was the first man to walk on the moon')) {
    response = 'Neil Armstrong was the first man to walk on the moon.';
} else if (userInput.includes('what is the chemical symbol for gold')) {
    response = 'The chemical symbol for gold is Au.';
} else if (userInput.includes('who painted the starry night')) {
    response = 'Vincent van Gogh painted The Starry Night.';
} else if (userInput.includes('what is the currency of the united kingdom')) {
    response = 'The currency of the United Kingdom is the British Pound Sterling.';
} else if (userInput.includes('what is the fastest land animal')) {
    response = 'The fastest land animal is the cheetah.';
} else if (userInput.includes('who wrote to kill a mockingbird')) {
    response = 'Harper Lee wrote To Kill a Mockingbird.';
} else if (userInput.includes('what is the main ingredient in guacamole')) {
    response = 'The main ingredient in guacamole is avocado.';
} else if (userInput.includes('what is the name of the largest ocean on Earth')) {
    response = 'The largest ocean on Earth is the Pacific Ocean.';
} else if (userInput.includes('who is known as the father of modern chemistry')) {
    response = 'Antoine Lavoisier is known as the father of modern chemistry.';
} else if (userInput.includes('what is the capital of mexico')) {
    response = 'The capital of Mexico is Mexico City.';
} else if (userInput.includes('who wrote pride and prejudice')) {
    response = 'Jane Austen wrote Pride and Prejudice.';
} else if (userInput.includes('what is the chemical symbol for hydrogen')) {
    response = 'The chemical symbol for hydrogen is H.';
} else if (userInput.includes('what is the capital of australia')) {
    response = 'The capital of Australia is Canberra.';
} else if (userInput.includes('who was the last czar of Russia')) {
    response = 'Nicholas II was the last czar of Russia.';
} else if (userInput.includes('what is the tallest building in the world')) {
    response = 'The tallest building in the world is the Burj Khalifa in Dubai.';
} else if (userInput.includes('who wrote moby dick')) {
    response = 'Herman Melville wrote Moby-Dick.';
} else if (userInput.includes('what is the chemical symbol for silver')) {
    response = 'The chemical symbol for silver is Ag.';
} else if (userInput.includes('what is the capital of sweden')) {
    response = 'The capital of Sweden is Stockholm.';
} else if (userInput.includes('who invented the telephone')) {
    response = 'Alexander Graham Bell is credited with inventing the telephone.';
} else if (userInput.includes('what is the most expensive spice in the world')) {
    response = 'The most expensive spice in the world is saffron.';
} else if (userInput.includes('what is the capital of norway')) {
    response = 'The capital of Norway is Oslo.';
} else if (userInput.includes('who wrote the grapes of wrath')) {
    response = 'John Steinbeck wrote The Grapes of Wrath.';
} else if (userInput.includes('what is the largest animal on Earth')) {
    response = 'The largest animal on Earth is the blue whale.';
} else if (userInput.includes('who painted the Mona Lisa')) {
    response = 'Leonardo da Vinci painted the Mona Lisa.';
} else if (userInput.includes('what is the capital of south africa')) {
    response = 'South Africa has three capitals: Pretoria, Cape Town, and Bloemfontein.';
} else if (userInput.includes('who is known for the theory of evolution')) {
    response = 'Charles Darwin is known for the theory of evolution.';
} else if (userInput.includes('what is the chemical symbol for mercury')) {
    response = 'The chemical symbol for mercury is Hg.';
} else if (userInput.includes('who wrote the great expectations')) {
    response = 'Charles Dickens wrote Great Expectations.';
} else if (userInput.includes('what is the capital of argentina')) {
    response = 'The capital of Argentina is Buenos Aires.';
} else if (userInput.includes('who discovered penicillin')) {
    response = 'Alexander Fleming discovered penicillin.';
} else if (userInput.includes('what is the name of the highest mountain in the world')) {
    response = 'The highest mountain in the world is Mount Everest.';
} else if (userInput.includes('who wrote the call of the wild')) {
    response = 'Jack London wrote The Call of the Wild.';
} else if (userInput.includes('what is the currency of france')) {
    response = 'The currency of France is the Euro.';
} else if (userInput.includes('who is the famous physicist known for his work on quantum mechanics')) {
    response = 'Niels Bohr is a famous physicist known for his work on quantum mechanics.';
} else if (userInput.includes('what is the capital of south korea')) {
    response = 'The capital of South Korea is Seoul.';
} else if (userInput.includes('who wrote don quixote')) {
    response = 'Miguel de Cervantes wrote Don Quixote.';
} else if (userInput.includes('what is the chemical symbol for potassium')) {
    response = 'The chemical symbol for potassium is K.';
} else if (userInput.includes('what is the capital of new zealand')) {
    response = 'The capital of New Zealand is Wellington.';
} else if (userInput.includes('who was the first manned spaceflight mission to land on the moon')) {
    response = 'Apollo 11 was the first manned spaceflight mission to land on the moon.';
} else if (userInput.includes('what is the capital of turkey')) {
    response = 'The capital of Turkey is Ankara.';
} else if (userInput.includes('who wrote a tale of two cities')) {
    response = 'Charles Dickens wrote A Tale of Two Cities.';
} else if (userInput.includes('what is the chemical symbol for calcium')) {
    response = 'The chemical symbol for calcium is Ca.';
} else if (userInput.includes('what is the capital of iran')) {
    response = 'The capital of Iran is Tehran.';
} else if (userInput.includes('who wrote brave new world')) {
    response = 'Aldous Huxley wrote Brave New World.';
} else if (userInput.includes('what is the largest mammal in the world')) {
    response = 'The largest mammal in the world is the blue whale.';
} else if (userInput.includes('who is known as the father of modern psychology')) {
    response = 'Sigmund Freud is known as the father of modern psychology.';
} else if (userInput.includes('what is the capital of chile')) {
    response = 'The capital of Chile is Santiago.';
} else if (userInput.includes('who wrote the hunchback of notre dame')) {
    response = 'Victor Hugo wrote The Hunchback of Notre-Dame.';
} else if (userInput.includes('what is the chemical symbol for nitrogen')) {
    response = 'The chemical symbol for nitrogen is N.';
} else if (userInput.includes('what is the capital of vietnam')) {
    response = 'The capital of Vietnam is Hanoi.';
} else if (userInput.includes('who discovered the structure of DNA')) {
    response = 'James Watson and Francis Crick are credited with discovering the structure of DNA.';
} else if (userInput.includes('what is the capital of malaysia')) {
    response = 'The capital of Malaysia is Kuala Lumpur.';
} else if (userInput.includes('who wrote catch-22')) {
    response = 'Joseph Heller wrote Catch-22.';
} else if (userInput.includes('what is the chemical symbol for sulfur')) {
    response = 'The chemical symbol for sulfur is S.';
} else if (userInput.includes('what is the capital of the netherlands')) {
    response = 'The capital of the Netherlands is Amsterdam.';
} else if (userInput.includes('who invented the first successful airplane')) {
    response = 'The Wright brothers invented the first successful airplane.';
} else if (userInput.includes('what is the capital of poland')) {
    response = 'The capital of Poland is Warsaw.';
} else if (userInput.includes('who wrote the invisible man')) {
    response = 'H.G. Wells wrote The Invisible Man.';
} else if (userInput.includes('what is the capital of colombia')) {
    response = 'The capital of Colombia is Bogotá.';
} else if (userInput.includes('who discovered radioactivity')) {
    response = 'Henri Becquerel discovered radioactivity.';
} else if (userInput.includes('what is the capital of saudi arabia')) {
    response = 'The capital of Saudi Arabia is Riyadh.';
} else if (userInput.includes('who wrote the time machine')) {
    response = 'H.G. Wells wrote The Time Machine.';
} else if (userInput.includes('what is the chemical symbol for zinc')) {
    response = 'The chemical symbol for zinc is Zn.';
} else if (userInput.includes('what is the capital of nigeria')) {
    response = 'The capital of Nigeria is Abuja.';
} else if (userInput.includes('who was the first female prime minister of the united kingdom')) {
    response = 'Margaret Thatcher was the first female Prime Minister of the United Kingdom.';
} else if (userInput.includes('what is the capital of thailand')) {
    response = 'The capital of Thailand is Bangkok.';
} else if (userInput.includes('who wrote the art of war')) {
    response = 'Sun Tzu wrote The Art of War.';
} else if (userInput.includes('what is the chemical symbol for chlorine')) {
    response = 'The chemical symbol for chlorine is Cl.';
} else if (userInput.includes('what is the capital of peru')) {
    response = 'The capital of Peru is Lima.';
} else if (userInput.includes('who is the famous artist known for the painting the scream')) {
    response = 'Edvard Munch is the famous artist known for the painting The Scream.';
} else if (userInput.includes('what is the capital of iceland')) {
    response = 'The capital of Iceland is Reykjavik.';
} else if (userInput.includes('who wrote the scarlet letter')) {
    response = 'Nathaniel Hawthorne wrote The Scarlet Letter.';
} else if (userInput.includes('what is the chemical symbol for iodine')) {
    response = 'The chemical symbol for iodine is I.';
} else if (userInput.includes('what is the capital of singapore')) {
    response = 'The capital of Singapore is Singapore.';
} else if (userInput.includes('who invented the printing press')) {
    response = 'Johannes Gutenberg invented the printing press.';
} else if (userInput.includes('what is the capital of kenya')) {
    response = 'The capital of Kenya is Nairobi.';
} else if (userInput.includes('who wrote the old man and the sea')) {
    response = 'Ernest Hemingway wrote The Old Man and the Sea.';
} else if (userInput.includes('what is the chemical symbol for platinum')) {
    response = 'The chemical symbol for platinum is Pt.';
} else if (userInput.includes('what is the capital of israel')) {
    response = 'The capital of Israel is Jerusalem.';
} else if (userInput.includes('who wrote one hundred years of solitude')) {
    response = 'Gabriel García Márquez wrote One Hundred Years of Solitude.';
} else if (userInput.includes('what is the chemical symbol for lead')) {
    response = 'The chemical symbol for lead is Pb.';
} else if (userInput.includes('what is the capital of malaysia')) {
    response = 'The capital of Malaysia is Kuala Lumpur.';
} else if (userInput.includes('who was the first woman to win the Nobel Prize')) {
    response = 'Marie Curie was the first woman to win the Nobel Prize.';
} else if (userInput.includes('what is the chemical symbol for phosphorus')) {
    response = 'The chemical symbol for phosphorus is P.';
} else if (userInput.includes('what is the capital of hungary')) {
    response = 'The capital of Hungary is Budapest.';
} else if (userInput.includes('who wrote the count of monte cristo')) {
    response = 'Alexandre Dumas wrote The Count of Monte Cristo.';
} else if (userInput.includes('what is the chemical symbol for neon')) {
    response = 'The chemical symbol for neon is Ne.';
} else if (userInput.includes('what is the capital of croatia')) {
    response = 'The capital of Croatia is Zagreb.';
} else if (userInput.includes('who wrote wuthering heights')) {
    response = 'Emily Brontë wrote wuthering Heights.';
} else if (userInput.includes('what is the chemical symbol for cobalt')) {
    response = 'The chemical symbol for cobalt is Co.';
} else if (userInput.includes('what is the capital of serbia')) {
    response = 'The capital of Serbia is Belgrade.';
} else if (userInput.includes('who wrote dracula')) {
    response = 'Bram Stoker wrote dracula.';
} else if (userInput.includes('what is the chemical symbol for lithium')) {
    response = 'The chemical symbol for lithium is Li.';
} else if (userInput.includes('what is the capital of bulgaria')) {
    response = 'The capital of Bulgaria is Sofia.';
} else if (userInput.includes('who wrote the jungle book')) {
    response = 'Rudyard Kipling wrote the Jungle Book.';
} else if (userInput.includes('what is the chemical symbol for tungsten')) {
    response = 'The chemical symbol for tungsten is W.';
} else if (userInput.includes('what is the capital of slovakia')) {
    response = 'The capital of Slovakia is Bratislava.';
} else if (userInput.includes('who wrote the picture of dorian gray')) {
    response = 'Oscar Wilde wrote The Picture of Dorian Gray.';
} else if (userInput.includes('what is the chemical symbol for barium')) {
    response = 'The chemical symbol for barium is Ba.';
} else if (userInput.includes('what is the capital of estonia')) {
    response = 'The capital of Estonia is Tallinn.';
} else if (userInput.includes('who wrote the golden bowl')) {
    response = 'Henry James wrote the Golden Bowl.';
} else if (userInput.includes('what is the chemical symbol for uranium')) {
    response = 'The chemical symbol for uranium is U.';
} else if (userInput.includes('what is the capital of albania')) {
    response = 'The capital of Albania is Tirana.';
} else if (userInput.includes('who wrote the kite runner')) {
    response = 'Khaled Hosseini wrote the Kite Runner.';
} else if (userInput.includes('what is the chemical symbol for zirconium')) {
    response = 'The chemical symbol for zirconium is Zr.';
} else if (userInput.includes('what is the capital of syria')) {
    response = 'The capital of Syria is Damascus.';
} else if (userInput.includes('who wrote the handmaid\'s tale')) {
    response = 'Margaret Atwood wrote the Handmaid\'s Tale.';
} else if (userInput.includes('what is the chemical symbol for ruthenium')) {
    response = 'The chemical symbol for ruthenium is Ru.';
} else if (userInput.includes('what is the capital of kuwait')) {
    response = 'The capital of Kuwait is Kuwait City.';
} else if (userInput.includes('who wrote the book thief')) {
    response = 'Markus Zusak wrote the Book thief.';
} else if (userInput.includes('what is the chemical symbol for strontium')) {
    response = 'the chemical symbol for strontium is Sr.';
} else if (userInput.includes('what is the capital of jamaica')) {
    response = 'the capital of Jamaica is Kingston.';
} else if (userInput.includes('who wrote the alchemist')) {
    response = 'Paulo Coelho wrote the alchemist.';
} else if (userInput.includes('what is the chemical symbol for gadolinium')) {
    response = 'the chemical symbol for gadolinium is Gd.';
} else if (userInput.includes('what is the capital of mongolia')) {
    response = 'the capital of Mongolia is Ulaanbaatar.';
} else if (userInput.includes('who wrote the poisonwood bible')) {
    response = 'Barbara Kingsolver wrote the Poisonwood Bible.';
} else if (userInput.includes('what is the chemical symbol for osmium')) {
    response = 'the chemical symbol for osmium is Os.';
} else if (userInput.includes('what is the capital of malawi')) {
    response = 'the capital of Malawi is Lilongwe.';
} else if (userInput.includes('who wrote a hundred years of solitude')) {
    response = 'Gabriel García Márquez wrote One Hundred Years of Solitude.';
 
 } else if (userInput.includes('state avogadro\'s Law')) {
 response = `Avogadro's Law states that the volume of a gas is directly proportional to the number of moles of gas, provided the temperature and pressure remain constant.
 
 Where:
 
 𝑉
 V is the volume
 𝑛
 n is the number of moles`;
 } else if (userInput.includes('graham\'s Law of effusion')) {
 response = `Graham's Law of Effusion states that the rate of effusion of a gas is inversely proportional to the square root of its molar mass.
 Where:
 
 𝑟
 r is the rate of effusion
 𝑀
 M is the molar mass`;
 
 } else if (userInput.includes('state ideal gas law')) {
 response = `The Ideal Gas Law is an equation of state that describes the behavior of an ideal gas by relating pressure, volume, temperature, and the number of moles of gas.
 
 Mathematically:
 𝑃𝑉 = 𝑛𝑅𝑇
 
 Where:
 
 𝑃 is the pressure
 𝑉 is the volume
 𝑛 is the number of moles
 𝑅 is the universal gas constant (8.314 J/(mol·K))
 𝑇 is the temperature in Kelvin`;
 
 } else if (userInput.includes('state the law of definite propostion')) {
 response = `The Law of Definite Proportions, also known as the Law of Constant Composition, states that a given chemical compound always contains its component elements in fixed, definite proportions by mass.`;
 
 } else if (userInput.includes('state the law of constant position')) {
 response = `The Law of Constant Composition, often referred to as the Law of Definite Proportions, states that a chemical compound always contains the same proportion of elements by mass, regardless of the amount or source of the compound.
 
 In other words, any sample of a pure chemical compound will have the same ratio of elements as any other sample of that compound. For instance, water (H₂O) will always have a mass ratio of approximately 8:1 between oxygen and hydrogen, no matter where it is obtained.`;
 
 } else if (userInput.includes('state the law of multiple proportion')) {
 response = `The Law of Multiple Proportions states that when two elements form more than one compound, the different masses of one element that combine with a fixed mass of the other element are in the ratio of small whole numbers.`;
 
 } else if (userInput.includes('state the cell theory')) {
 response = `The Cell Theory is a fundamental concept in biology that describes the properties and functions of cells. It has three main principles:
 
 1. All Living Organisms Are Composed of Cells:
 - Every organism, whether unicellular or multicellular, is made up of one or more cells. This principle emphasizes that cells are the basic building blocks of all living things.
 
 2. The Cell is the Basic Unit of Life:
 - The cell is the smallest unit of life that can perform all the functions necessary for an organism to live. This means that all the essential processes of life, such as metabolism, growth, and reproduction, occur within cells.
 
 3. All Cells Arise from Pre-existing Cells:
 - New cells are produced by the division of existing cells. This principle asserts that cells do not spontaneously arise but are generated from the division of pre-existing cells, thus maintaining continuity of life.
 
 Historical Context:
 - The Cell Theory was developed in the mid-19th century by scientists Matthias Schleiden, Theodor Schwann, and Rudolf Virchow. Schleiden and Schwann contributed to the understanding that all plants and animals are made of cells, while Virchow added the idea that cells come from other cells.
 
 Implications:
 - The Cell Theory is fundamental to understanding biology, as it`;
 
 } else if (userInput.includes('what is cloud') ||(userInput.includes('define the cloud'))) {
 response = `In the context of computing and technology, cloud refers to cloud computing, a model that allows users to access and use computing resources over the internet. This means that instead of relying on local servers or personal computers, users can access services, storage, and applications from remote servers managed by cloud service providers.
 
 Key Characteristics of Cloud Computing:
 1. On-Demand Self-Service:
 - Users can provision computing capabilities, such as server time and network storage, as needed automatically without requiring human interaction with each service provider.
 
 2. Broad Network Access:
 - Cloud services are available over the network and can be accessed from various devices such as laptops, smartphones, and tablets.
 
 3. Resource Pooling:
 - Cloud providers pool their computing resources to serve multiple consumers, with different physical and virtual resources dynamically assigned and reassigned according to demand.
 
 4. Rapid Elasticity:
 - Cloud resources can be rapidly and elastically provisioned to scale outwards when needed and released when no longer required, often automatically.
 
 5. Measured Service:
 - Cloud systems automatically control and optimize resource use by leveraging a metering capability. Resource usage can be monitored, controlled, and reported, providing transparency for both the provider and the consumer.
 
 Types of Cloud Services:
 1. Infrastructure as a Service (IaaS):
 - Provides virtualized computing resources over the internet. Examples include virtual machines, storage, and networks. Providers include AWS, Microsoft Azure, and Google Cloud Platform.
 
 2. Platform as a Service (PaaS):
 - Offers hardware and software tools over the internet, typically for application development. Developers can build, deploy, and manage applications without worrying about underlying infrastructure. Examples include Google App Engine and Microsoft Azure App Services.
 
 3. Software as a Service (SaaS):
 - Delivers software applications over the internet, on a subscription basis. Users access the software through a web browser without needing to install or maintain it locally. Examples include Google Workspace (formerly G Suite) and Microsoft Office 365.
 
 Examples of Cloud Computing:
 - Storage Services: Google Drive, Dropbox, and OneDrive.
 - Collaboration Tools: Zoom, Slack, and Microsoft Teams.
 - Compute Services: Amazon EC2, Google Compute Engine, and Microsoft Azure VMs.
 
 Cloud can also refer to cloud storage and cloud services, which involve storing data and utilizing computing services over the internet.`;
 } else if (userInput.includes('what is electronic induction')||(userInput.includes('define electronic induction'))) {
 response = `Electronic induction is a broad term that can refer to various processes and technologies involving the use of electronic or electromagnetic fields to induce effects. Here are some common contexts in which the term might be used:
 
 1. Inductive Charging
 - Definition: Wireless power transfer through electromagnetic induction.
 - How it Works: An inductive charging system uses an alternating magnetic field to transfer energy between two coils. One coil (the transmitter) generates an electromagnetic field, and the other coil (the receiver) picks up this field to convert it back into electrical energy.
 - Applications: Used in wireless charging for devices like smartphones, electric toothbrushes, and some electric vehicles.
 
 2. Electromagnetic Induction
 - Definition: The process of generating electric current in a conductor by changing the magnetic field around it.
 - How it Works: When a conductor (like a wire) moves through a magnetic field or when the magnetic field around a stationary conductor changes, an electric current is induced in the conductor. This is described by Faraday's Law of Induction.
 - Applications: Used in electric generators, transformers, and induction motors.
 
 3. Inductive Sensors
 - Definition: Sensors that use electromagnetic fields to detect the presence or position of an object.
 - How it Works: Inductive sensors detect changes in inductance caused by the presence of a conductive material. These sensors are often used in industrial automation.
 - Applications: Used in proximity sensors, object detection, and position sensing.
 
 4. Inductive Heating
 - Definition: A process that heats materials using electromagnetic induction.
 - How it Works: An alternating current is passed through a coil to generate a magnetic field. This magnetic field induces eddy currents in the material being heated, which results in resistance heating.
 - Applications: Used in metal hardening, cooking (induction cooktops), and melting.
 
 Key Principles:
 - Faraday's Law of Electromagnetic Induction: States that the induced electromotive force (EMF) in a circuit is directly proportional to the rate of change of the magnetic flux through the circuit.
 - Lenz's Law: Describes the direction of the induced current: it always opposes the change in magnetic flux that produced it.
 
 If you have a specific context or application in mind, let me know, and I can provide more detailed information!`;
 
 
 } else if (userInput.includes('state drawin\'s theory of evolution')) {
 response = `Charles Darwin’s theory of evolution, primarily detailed in his seminal work "On the Origin of Species" (1859), fundamentally changed our understanding of biological diversity and the process of evolution. Here's an outline of the key elements of Darwin's theory:
 
 1. Variation
 - Concept: Within a species, individuals exhibit variations in their traits (e.g., size, color, behavior).
 - Source: Variations are often inherited from parents but can also arise from mutations or other factors.
 
 2. Overproduction
 - Concept: Most species tend to produce more offspring than the environment can support.
 - Implication: This leads to a struggle for survival among individuals of a species, as resources are limited.
 
 3. Struggle for Existence
 - Concept: Due to overproduction, there is competition for limited resources (food, shelter, mates) among individuals of a species.
 - Outcome: Not all individuals survive to reproduce; those with advantageous traits are more likely to survive and reproduce.
 
 4. Natural Selection
 - Concept: The process through which individuals with traits better suited to their environment have a higher chance of surviving and reproducing.
 - Mechanism: Those individuals pass on their advantageous traits to their offspring, leading to gradual changes in the population over generations.
 - Outcome: This leads to the adaptation of organisms to their environment and the evolution of new species.
 
 5. Descent with Modification
 - Concept: All species are related through common ancestry. As species evolve, they descend from common ancestors but with modifications.
 - Implication: This explains the diversity of life and the branching patterns of evolutionary relationships.
 
 6. Survival of the Fittest
 - Concept: “Fitness” refers to an organism’s ability to survive and reproduce. Those best adapted to their environment are considered the “fittest.”
 - Misinterpretation: This phrase is often misunderstood to mean only the strongest survive, but in Darwin’s context, it refers to adaptability and reproductive success.
 
 7. Geological and Fossil Evidence
 - Concept: Darwin used evidence from geology and fossils to support his theory, showing that species change over time and that new species can arise from existing ones.
 - Implication: The fossil record provides snapshots of evolutionary change and the progression of life forms.
 
 Additional Contributions:
 - Sexual Selection: Darwin also proposed that some traits evolve not just for survival advantage but also for mating success. Traits that are attractive to potential mates can become more common through sexual selection.
 - Adaptive Radiation: Darwin observed that species adapt to different ecological niches, leading to diversification from a common ancestor.
 
 Darwin’s theory was groundbreaking because it provided a scientific framework for understanding the diversity of life on Earth through natural processes rather than supernatural explanations. It laid the foundation for modern evolutionary biology and has been expanded and refined with the advent of genetics and modern evolutionary theory.`;
 } else if (userInput.includes('what is mitosis')||(userInput.includes('define mitosis'))) {
 response = `Mitosis is a process of cell division that results in two genetically identical daughter cells from a single parent cell. It is a fundamental mechanism for growth, development, and tissue repair in multicellular organisms. Here’s a breakdown of the stages and key concepts of mitosis:`;
 } else if (userInput.includes('are you mad')||(userInput.includes('are you crazy'))) {
 response = `I am not but, you are and, if you ask me that again you will hate me`;
 } else if (userInput.includes('are you out of your sensen')||(userInput.includes('are you out of your sense'))) {
 response = `You too, are you out of your senses So if they say people that have sense should come out you will come out, idiot`;
 } else if (userInput.includes('define oxidation')) {
     response = 'Oxidation is the loss of electrons by a molecule, atom, or ion.';


    } else if (userInput.includes('principals of cooperation')) {
        response = `The principles of cooperation outline the foundational concepts and guidelines that guide individuals and groups in working together effectively. Here are some key principles:

1.  David Mutual Benefit David: Cooperation should result in benefits for all parties involved. Each participant contributes and receives value from the cooperative effort.

2.  David Voluntary Participation David : Cooperation is voluntary and based on the willingness of individuals or groups to collaborate. It involves mutual consent and agreement to work together towards a common goal.

3.  David Open Communication David : Effective communication is essential for cooperation to succeed. Clear and open communication ensures that all participants understand roles, responsibilities, and expectations.

4.  David Equality and Equity David : Cooperation should be based on principles of fairness, where participants have equal opportunities to contribute and benefit. Equity ensures that contributions and rewards are proportionate to effort and need.

5.  David Trust and Respect David : Trust is fundamental in cooperative relationships. Participants should trust each other's intentions, capabilities, and commitments. Respect for diversity of opinions, skills, and backgrounds fosters a collaborative environment.

6.  David Shared Goals and Values David : Cooperation requires alignment around shared goals, values, and objectives. Participants should have a common purpose that guides their actions and decisions.

7.  David Flexibility and Adaptability David : Cooperative efforts often require flexibility to accommodate changing circumstances, diverse perspectives, and evolving goals. Adaptability ensures that participants can adjust strategies and approaches as needed.

8.  David Accountability David : Participants in cooperation are accountable for their commitments and contributions. Accountability ensures that everyone fulfills their roles and responsibilities towards achieving shared objectives.

9.  David Conflict Resolution David : Conflicts may arise in cooperative settings due to different perspectives or interests. Effective cooperation involves mechanisms for resolving conflicts constructively, such as negotiation, mediation, or consensus-building.

10.  David Sustainability David : Sustainable cooperation considers long-term impacts and benefits, striving for outcomes that are beneficial not only in the short term but also for future generations or ongoing relationships.

These principles guide cooperative efforts across various contexts, from business partnerships and community initiatives to international relations and everyday interactions.`;

    } else if (userInput.includes('list any advantages of co-operation')||(userInput.includes('advantages of co-operation'))) {
        response = `Certainly! Here are ten advantages of cooperation:

1. Synergy: Cooperation often leads to synergy, where the combined effort of individuals or groups achieves more than the sum of their individual efforts.
   
2. Increased Efficiency: When people work together, tasks can be divided based on strengths and expertise, leading to faster and more efficient completion of goals.
   
3. Enhanced Creativity: Collaborative environments foster creativity and innovation as different perspectives and ideas are shared and combined.
   
4. Shared Resources: Cooperation allows for the pooling of resources such as time, money, equipment, and expertise, making it possible to tackle larger projects or challenges.
   
5. Risk Sharing: By working together, risks can be distributed among participants, reducing individual risk exposure and enhancing overall stability.
   
6. Improved Problem-Solving: Multiple minds working together can generate a wider range of solutions to complex problems, leading to better decision-making.
   
7. Building Trust and Relationships: Cooperation builds trust among participants and strengthens relationships, which can lead to future opportunities and collaborations.
   
8. Personal Growth: Working in a cooperative environment encourages learning from others, developing new skills, and gaining valuable experience.
   
9. Increased Satisfaction: Collaborative efforts often result in a sense of accomplishment and satisfaction from achieving shared goals as a team.
   
10. Social Cohesion: Cooperation fosters a sense of community and unity among individuals or groups, promoting social cohesion and a supportive environment.

These advantages highlight how cooperation can be beneficial not only in achieving specific goals but also in fostering personal and social development.`;

    } else if (userInput.includes('what is co-operation')|| (userInput.includes('what is cooperation'))) {
        response = `Cooperation refers to the act of individuals or groups working together towards a common goal or purpose. It involves mutual assistance, collaboration, and coordination among participants to achieve shared objectives. Cooperation often involves sharing resources, information, skills, and efforts in a manner that benefits all parties involved. It's a fundamental aspect of human social behavior and plays a crucial role in various aspects of life, including business, politics, international relations, and everyday interactions.`;

    } else if (userInput.includes('concept of cooperation')) {
        response = `The concept of cooperation encompasses the idea of individuals or groups working together synergistically to achieve common goals or mutual benefits. It involves collaboration, coordination, and shared efforts aimed at achieving outcomes that would be difficult or impossible to accomplish individually. Here are key aspects of the concept of cooperation:

1. Mutual Benefit: Cooperation is based on the principle that all participants stand to gain from working together. It involves mutual assistance, where each party contributes resources, skills, or efforts to achieve shared objectives.

2. Shared Goals: Cooperation requires alignment around shared goals or objectives. Participants work towards a common purpose, pooling their strengths and resources to achieve outcomes that benefit all involved.

3. Voluntary Participation: Participation in cooperation is voluntary and based on the willingness of individuals or groups to collaborate. It involves mutual consent and agreement to work together towards a shared vision.

4. Interdependence: Cooperative relationships often involve a degree of interdependence, where the actions and contributions of each participant affect the outcomes for the group as a whole. This encourages communication, trust, and mutual reliance.

5. Synergy: Cooperation often leads to synergy, where the combined efforts of individuals or groups produce results that exceed what could be achieved by each party working alone. Synergy results from complementary strengths, skills, and perspectives.

6. Social Cohesion: Cooperation fosters a sense of community and social cohesion among participants. It promotes unity, trust, and collaboration, creating a supportive environment for shared endeavors.

7. Effective Communication: Clear and open communication is essential for successful cooperation. It ensures that participants understand roles, expectations, and objectives, facilitating coordination and collaboration.

8. Conflict Resolution: Conflicts may arise in cooperative settings due to differing opinions, priorities, or interests. Effective cooperation involves mechanisms for resolving conflicts constructively and maintaining positive relationships.

9. Long-term Orientation: Sustainable cooperation considers long-term outcomes and relationships. It aims to build enduring partnerships and achieve outcomes that benefit participants over time, rather than focusing solely on short-term gains.

10. Cultural and Contextual Variations: The concept of cooperation can vary across cultures and contexts, influenced by societal norms, values, and historical experiences. Understanding these variations is important for fostering effective cooperation in diverse settings.

Overall, cooperation plays a crucial role in various aspects of human life, from business and economics to social interactions, politics, and international relations. It promotes mutual understanding, shared prosperity, and collective problem-solving, contributing to positive outcomes for individuals, communities, and societies as a whole.`;

    } else if (userInput.includes('Explain how to get the most out of ChatGPT. Share tips and give specific examples. Ask me a question to get started.')) {
        response = `Sure, I'd be happy to help you get the most out of ChatGPT! To tailor my advice specifically to your needs, could you tell me what you primarily want to use ChatGPT for For example, are you looking to improve your productivity, generate creative content, learn something new, or get assistance with a specific task`;

    } else if (userInput.includes('define or explain self-reliance')||(userInput.includes('what is self-reliance'))) {
        response = `Self-reliance is the ability and practice of relying on oneself for support, guidance, or resources, rather than depending on others. It emphasizes independence, confidence in one's abilities, and taking responsibility for one's own decisions and actions. Here are a few key aspects that define self-reliance:

1. Independence: Self-reliance involves being able to handle tasks, challenges, and decisions without constant assistance or approval from others.

2. Self-confidence: It includes having belief in one's own capabilities and judgment, allowing one to trust their instincts and skills.

3. Personal Responsibility: Self-reliance means taking ownership of one's choices and actions, understanding that outcomes are largely influenced by one's efforts and decisions.

4. Resourcefulness: It involves the ability to find solutions and make use of available resources effectively, often through creativity and adaptability.

5. Autonomy: Self-reliance fosters a sense of personal freedom and empowerment, as individuals are less reliant on external validation or support to pursue their goals.

Cultivating self-reliance can lead to greater resilience, personal growth, and a stronger sense of identity and accomplishment. It's a valuable trait in both personal development and professional success.`;

    } else if (userInput.includes('what is relying')) {
        response = `"Relying" refers to depending on someone or something for support, assistance, or fulfillment of a need. It involves placing trust or confidence in someone or something to provide the necessary help or resources. When you rely on someone, you count on them to be dependable and capable of fulfilling their role or obligation. Here are a few key points that characterize relying:

1. Trust: Relying on someone implies a level of trust that they will meet your expectations or needs.

2. Dependency: It involves needing another person's assistance or support to achieve a desired outcome or to handle a situation.

3. Expectation: Relying on something means expecting it to perform as expected or deliver the desired result.

4. Mutuality: Relying often involves reciprocal relationships where trust and support are exchanged between parties.

Overall, relying on others is a fundamental aspect of social interaction and collaboration, as it allows individuals and groups to work together towards common goals or to navigate challenges collectively.`;

    } else if (userInput.includes('dose self-reliance has diadvantages')) {
        response = `While self-reliance is generally seen as a positive trait, like any other quality, it can have its disadvantages or challenges:

1. Isolation: Excessive self-reliance can lead to isolation or reluctance to seek help from others, even when it's necessary. This can hinder collaboration and support from friends, family, or colleagues.

2. Burnout: Individuals who are overly self-reliant may take on too much responsibility, leading to burnout or stress. They may feel pressure to handle everything themselves, neglecting self-care or personal well-being.

3. Limited Perspectives: Relying solely on one's own experiences and knowledge can limit perspectives and creativity. Collaborating with others can bring in fresh ideas and alternative viewpoints.

4. Risk of Mistakes: No one is infallible, and being self-reliant doesn't exempt someone from making mistakes. Without input from others, there's a higher risk of overlooking potential pitfalls or making flawed decisions.

5. Developmental Stagnation: Learning and personal growth often come from interactions and experiences shared with others. Over-reliance on oneself may limit opportunities for growth and skill development.

6. Emotional Impact: It can be emotionally taxing to constantly shoulder burdens alone. Seeking and receiving support from others can provide emotional relief and validation.

Overall, while self-reliance is valuable, it's important to strike a balance with interdependence and collaboration, recognizing when it's beneficial to seek help or input from others. Flexibility in approaching challenges and openness to different perspectives can enhance overall effectiveness and well-being.`;

    } else if (userInput.includes('advantages of self-reliance')) {
        response = `Certainly! Self-reliance offers several advantages that contribute to personal growth, resilience, and success:

1. Independence: Self-reliant individuals are capable of making decisions and taking action independently, which fosters a sense of autonomy and freedom.

2. Confidence: Relying on oneself builds self-confidence and self-esteem, as individuals learn to trust their own abilities and judgment.

3. Resourcefulness: Self-reliant people are often more resourceful, finding creative solutions to challenges and making efficient use of available resources.

4. Personal Accountability: Taking responsibility for one's actions and decisions is a key aspect of self-reliance, which promotes accountability and a sense of ownership.

5. Resilience: Self-reliance cultivates resilience in the face of adversity. Individuals are better equipped to bounce back from setbacks and handle difficult situations independently.

6. Empowerment: By relying on themselves, individuals feel empowered to pursue their goals and aspirations, knowing they have the capability to overcome obstacles.

7. Adaptability: Self-reliant individuals tend to be more adaptable and flexible in various situations, as they are accustomed to finding solutions and adjusting to changing circumstances.

8. Personal Growth: Embracing self-reliance encourages continuous learning and personal growth, as individuals challenge themselves to acquire new skills and knowledge.

9. Leadership: Self-reliant individuals often exhibit leadership qualities, as they inspire confidence in others and can take initiative in guiding projects or teams.

10. Reduced Dependence: Being self-reliant reduces dependence on others for validation or support, promoting a sense of self-sufficiency and inner strength.

Overall, self-reliance is a valuable trait that enhances both personal development and professional success, enabling individuals to navigate life's challenges with resilience and confidence.`;

    } else if (userInput.includes('all the abbreviation in nigeria')) {
        response = `In Nigeria, like in many other countries, abbreviations are used across various sectors and contexts. Here are some common abbreviations used in Nigeria:

1. NG - Nigeria (Country code)
2. NGN - Nigerian Naira (Currency)
3. EFCC - Economic and Financial Crimes Commission
4. NNPC - Nigerian National Petroleum Corporation
5. CBN - Central Bank of Nigeria
6. INEC - Independent National Electoral Commission
7. NYSC - National Youth Service Corps
8. JAMB - Joint Admissions and Matriculations Board
9. WAEC - West African Examinations Council
10. NECO - National Examinations Council
11. NASS - National Assembly
12. FIRS - Federal Inland Revenue Service
13. ICPC - Independent Corrupt Practices and Other Related Offences Commission
14. DSS - Department of State Services
15. LASG - Lagos State Government
16. FCT - Federal Capital Territory
17. APC - All Progressives Congress (Political Party)
18. PDP - People's Democratic Party (Political Party)
19. NNPC - Nigerian National Petroleum Corporation
20. NIMC - National Identity Management Commission

These abbreviations are commonly used in government, education, finance, politics, and various other sectors within Nigeria.`;

    } else if (userInput.includes('all the abbreviations in the world')) {
        response = `Listing all the abbreviations used worldwide would be an immense task, as abbreviations are numerous and vary greatly across languages, cultures, and industries. However, here are some common types of abbreviations used globally:

1. Acronyms: Abbreviations formed from the initial letters or parts of a phrase, pronounced as a word (e.g., NASA - National Aeronautics and Space Administration).

2. Initialisms: Abbreviations formed from the initial letters or parts of a phrase, pronounced letter by letter (e.g., FBI - Federal Bureau of Investigation).

3. Shortenings: Abbreviations that truncate a word or phrase, typically retaining the beginning and sometimes the end (e.g., Prof. - Professor).

4. Symbols: Abbreviations represented by symbols or characters, such as mathematical symbols (e.g., √ for square root).

5. Contractions: Abbreviations formed by omitting one or more letters or sounds from a word (e.g., don't - do not).

Here are a few examples of common international abbreviations:

- UN - United Nations
- EU - European Union
- USA - United States of America
- UK - United Kingdom
- GDP - Gross Domestic Product
- CEO - Chief Executive Officer
- COVID-19 - Coronavirus Disease 2019

The usage and significance of abbreviations vary widely depending on context, language, and regional conventions.`;

    } else if (userInput.includes('what is the full meaning of ecowas')) {
        response = `ECOWAS stands for Economic Community of West African States. It is a regional intergovernmental organization founded on May 28, 1975, with the aim of promoting economic integration and cooperation among its member states in West Africa. The member states of ECOWAS are:

1. Benin
2. Burkina Faso
3. Cape Verde
4. Ivory Coast (Côte d'Ivoire)
5. The Gambia
6. Ghana
7. Guinea
8. Guinea-Bissau
9. Liberia
10. Mali
11. Niger
12. Nigeria
13. Senegal
14. Sierra Leone
15. Togo

ECOWAS aims to achieve economic growth and development, peace and security, and political stability among its member countries through various initiatives and policies.`;


 } else if (userInput.includes('define reduction')) {
     response = 'Reduction is the gain of electrons by a molecule, atom, or ion.😊';
 } else if (userInput.includes('What is a catalyst')) {
    response = 'A catalyst is a substance that increases the rate of a chemical reaction without being consumed in the process.😊';
 } else if (userInput.includes('What is the law of conservation of mas')) {
     response= 'The law of conservation of mass states that mass is neither created nor destroyed in a chemical reaction.😊';
 } else if (userInput.includes('define isotope') || (userInput.includes('what is isotopes'))) {
    response = 'Isotopes are variants of a particular chemical element that have the same number of protons but different numbers of neutrons." 😊';
 }else if (userInput.includes('what is pronoun')||(userInput.includes('define pronoun'))||(userInput.includes('what is a pronoun'))) {
     response = `Pronouns are words used to replace nouns in a sentence, thereby avoiding repetition and simplifying language. They serve as substitutes for specific names of people, places, things, or ideas. Here’s a brief overview:
 
  Types of Pronouns:
 
 1. Personal Pronouns
    - Definition: Refer to specific people or things and change form based on the person, number, gender, and case.
    - Examples:
      - Subject: I, you, he, she, it, we, they
      - Object: me, you, him, her, it, us, them
      - Possessive: my, your, his, her, its, our, their
 
 2. Possessive Pronouns
    - Definition: Indicate ownership or possession.
    - Examples: mine, yours, his, hers, ours, theirs
    - Usage: These pronouns stand alone and do not precede a noun (e.g., “This book is mine.”).
 
 3. Reflexive Pronouns
    - Definition: Refer back to the subject of the sentence.
    - Examples: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves
    - Usage: Used when the subject and object of the verb are the same (e.g., “She taught herself to play the piano.”).
 
 4. Demonstrative Pronouns
    - Definition: Point to specific things or people.
    - Examples: this, that, these, those
    - Usage: Indicate specific items relative to the speaker’s position (e.g., “This is my book.”).
 
 5. Interrogative Pronouns
    - Definition: Used to ask questions about people or things.
    - Examples: who, whom, whose, which, what
    - Usage: Introduce questions (e.g., “Who is coming to the party”).
 
 6. Relative Pronouns
    - Definition: Connect clauses or phrases to nouns or pronouns.
    - Examples: who, whom, whose, which, that
    - Usage: Provide more information about a noun (e.g., “The book that you lent me was fascinating.”).
 
 7. Indefinite Pronouns
    - Definition: Refer to non-specific people or things.
    - Examples: anyone, anyone, everyone, somebody, none, few, several
    - Usage: Used when the exact identity of the noun is not known (e.g., “Someone left a message for you.”).
 
  Functions of Pronouns:
 - Avoid Repetition: Pronouns replace nouns to prevent redundancy (e.g., “Lisa went to Lisa’s car” → “Lisa went to her car”).
 - Clarify Relationships: They help clarify relationships between people and objects within sentences.
 
 Pronouns are essential for smooth and clear communication, helping to make sentences less cumbersome and more efficient.😊`;
 } else if (userInput.includes('what is verb')||(userInput.includes('define verb'))||(userInput.includes('what is a verb'))) {
     response = `A word that expresses an action or a state of being. Examples: "run," "is," "seem."😊`;
 } else if (userInput.includes('what is your age')||(userInput.includes('say your age'))||(userInput.includes('explain your age'))) {
     response = `I don't have an age as I am an artificial intelligence created by DevelopeAI. I don't experience time or age like humans do. I'm here to assist you with information and tasks to the best of my abilities!😊`;
 } else if (userInput.includes('who is satan')||(userInput.includes('who is Satan'))||(userInput.includes('who is demon'))||(userInput.includes('who is Demon'))){
     response = `the most evil man and person in the whole word`;
 
 } else if (userInput.includes('say the english alphabet')||(userInput.includes('what are the english alphabet'))||(userInput.includes('say the 36 english alphabet'))){
     response = `Sure! The English alphabet consists of 26 letters:
 
 A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z`;
     
 } else if (userInput.includes('what is adjective')||(userInput.includes('define adjective'))||(userInput.includes('what is an adjective'))) {
     response = `A word that describes or modifies a noun. Examples: "happy," "blue," "fast."😊`;
 } else if (userInput.includes('what is adverb')||(userInput.includes('define adverb'))||(userInput.includes('what is an adverb'))) {
     response = `A word that describes or modifies a verb, an adjective, or another adverb. Examples: "quickly," "very," "well."😊`;
 } else if (userInput.includes('what is preposition')||(userInput.includes('define preposition'))||(userInput.includes('what is a preposition'))) {
     response = `A word that shows the relationship between a noun (or pronoun) and other words in a sentence. Examples: "in," "on," "at," "between."😊`;
 } else if (userInput.includes('what is conjunction')||(userInput.includes('define conjunction'))||(userInput.includes('what is a conjunction'))) {
     response = `A word that connects words, phrases, or clauses. Examples: "and," "but," "or," "because."😊`;
 } else if (userInput.includes('what is interjection')||(userInput.includes('define interjection'))||(userInput.includes('what is a interjection'))) {
     response = `A word or phrase that expresses strong emotion or surprise. Examples: "Wow!," "Oh no!," "Yikes!"😊`;
 } else if (userInput.includes('what is article')||(userInput.includes('define article'))||(userInput.includes('what is a article'))) {
     response = `A word that defines a noun as specific or unspecific. Examples: "the" (definite), "a," "an" (indefinite).`;
 } else if (userInput.includes('what is determiner')||(userInput.includes('define determiner'))||(userInput.includes('what is a determiner'))) {
     response = `A word that introduces a noun and specifies it in some way. Examples: "this," "that," "these," "those," "my," "your."😊`;
 } else if (userInput.includes('show me all the part of speech and their meanings')||(userInput.includes('give me all the part of speech and their meaning'))||(userInput.includes('explain all the part of speech and their meaning'))) {
     response = `Certainly! Here are the parts of speech along with their meanings:
 
 1. Noun: A word that represents a person, place, thing, or idea. Examples: "dog," "city," "happiness."
 
 2. Pronoun: A word that takes the place of a noun. Examples: "he," "she," "it," "they."
 
 3. Verb: A word that expresses an action or a state of being. Examples: "run," "is," "seem."
 
 4. Adjective: A word that describes or modifies a noun. Examples: "happy," "blue," "fast."
 
 5. Adverb: A word that describes or modifies a verb, an adjective, or another adverb. Examples: "quickly," "very," "well."
 
 6. Preposition: A word that shows the relationship between a noun (or pronoun) and other words in a sentence. Examples: "in," "on," "at," "between."
 
 7. Conjunction: A word that connects words, phrases, or clauses. Examples: "and," "but," "or," "because."
 
 8. Interjection: A word or phrase that expresses strong emotion or surprise. Examples: "Wow!," "Oh no!," "Yikes!"
 
 9. Article: A word that defines a noun as specific or unspecific. Examples: "the" (definite), "a," "an" (indefinite).
 
 10. Determiner: A word that introduces a noun and specifies it in some way. Examples: "this," "that," "these," "those," "my," "your."
 
 Each part of speech plays a crucial role in the structure and meaning of sentences.😊`;
 
 } else if (userInput.includes('show me all the figures of speech and their meaning')||(userInput.includes('give me all the figures of speech and their meaning '))||(userInput.includes('show me all the figures of speech and their meaning '))) {
     response = `Figures of speech are rhetorical devices used to convey meanings in more vivid or imaginative ways than literal language allows. Here’s a comprehensive list of common figures of speech along with their meanings:
 
  1. Simile
    - Definition: A comparison between two different things using "like" or "as."
    - Example: "Her smile was as bright as the sun."
    - Purpose: To create a vivid image by comparing one thing with another.
 
  2. Metaphor
    - Definition: A direct comparison between two unlike things without using "like" or "as."
    - Example: "Time is a thief."
    - Purpose: To suggest a similarity between two things in a more implicit manner.
 
  3. Personification
    - Definition: Assigning human characteristics to non-human objects or abstract concepts.
    - Example: "The wind whispered through the trees."
    - Purpose: To make descriptions more relatable and vivid.
 
  4. Hyperbole
    - Definition: An exaggerated statement not meant to be taken literally.
    - Example: "I’ve told you a million times."
    - Purpose: To emphasize a point or create a strong impression.
 
  5. Understatement
    - Definition: The presentation of something as being smaller or less important than it actually is.
    - Example: "It’s just a scratch" (when referring to a large dent).
    - Purpose: To downplay the significance or impact of something.
 
  6. Alliteration
    - Definition: The repetition of the initial consonant sounds in a series of words.
    - Example: "She sells sea shells by the sea shore."
    - Purpose: To create rhythm and enhance the musical quality of language.
 
  7. Assonance
    - Definition: The repetition of vowel sounds within nearby words.
    - Example: "The early bird catches the worm."
    - Purpose: To create musicality and cohesion in speech or writing.
 
  8. Onomatopoeia
    - Definition: Words that imitate natural sounds.
    - Example: "The bees buzzed around the garden."
    - Purpose: To mimic sounds and create a more sensory experience.
 
  9. Irony
    - Definition: A contrast between expectation and reality, often used to convey the opposite of what is said.
    - Example: Saying "What a beautiful day" during a storm.
    - Purpose: To highlight contradictions and often add humor or emphasize a point.
 
  10. Oxymoron
    - Definition: A combination of contradictory terms.
    - Example: "Deafening silence."
    - Purpose: To reveal a paradox or highlight a complex situation.
 
  11. Paradox
    - Definition: A statement that seems contradictory but reveals a deeper truth.
    - Example: "Less is more."
    - Purpose: To provoke thought and illustrate complex ideas.
 
  12. Metonymy
    - Definition: A figure of speech where one word or phrase is substituted for another with which it is closely associated.
    - Example: "The White House announced new policies" (where "The White House" stands for the U.S. government).
    - Purpose: To make abstract ideas more tangible or provide a more focused description.
 
  13. Synecdoche
    - Definition: A figure of speech in which a part represents the whole, or the whole represents a part.
    - Example: "All hands on deck" (where "hands" represents the sailors).
    - Purpose: To emphasize particular aspects of a larger entity.
 
  14. Euphemism
    - Definition: A mild or less direct word or phrase used to avoid offending or upsetting.
    - Example: "He passed away" instead of "He died."
    - Purpose: To soften the impact of difficult or unpleasant information.
 
  15. Allusion
    - Definition: An indirect reference to a person, place, event, or literary work.
    - Example: "He’s a real Romeo with the ladies."
    - Purpose: To draw connections or evoke certain associations.
 
  16. Anaphora
    - Definition: The repetition of a word or phrase at the beginning of successive clauses.
    - Example: "I have a dream that one day this nation will rise up... I have a dream today!"
    - Purpose: To emphasize a particular idea and create rhythm.
 
  17. Antithesis
    - Definition: A contrast between two opposing ideas presented in a parallel structure.
    - Example: "It was the best of times, it was the worst of times."
    - Purpose: To highlight differences and create a striking effect.
 
  18. Chiasmus
    - Definition: A rhetorical device where two or more clauses are balanced against each other by reversing their structure.
    - Example: "Ask not what your country can do for you—ask what you can do for your country."
    - Purpose: To create emphasis and a memorable rhythm.
 
 These figures of speech enrich language, adding depth, color, and nuance to both written and spoken expression.😊`;
 } else if (userInput.includes('what is simile')||(userInput.includes('define simile'))||(userInput.includes('what is a simile'))) {
     response = `Definition: A comparison between two different things using "like" or "as."
 Example: "Her smile was as bright as the sun."
 Purpose: To create a vivid image by comparing one thing with another.😊`;
 } else if (userInput.includes('what is metaphor')||(userInput.includes('define metaphor'))||(userInput.includes('what is a metaphor'))) {
     response = `Definition: A direct comparison between two unlike things without using "like" or "as."
 Example: "Time is a thief."
 Purpose: To suggest a similarity between two things in a more implicit manner.😊`;
 } else if (userInput.includes('what is personification')||(userInput.includes('define personification'))||(userInput.includes('what is an personification'))) {
     response = `Definition: Assigning human characteristics to non-human objects or abstract concepts.
 Example: "The wind whispered through the trees."
 Purpose: To make descriptions more relatable and vivid.😊`;
 } else if (userInput.includes('what is  hyperbole')||(userInput.includes('define  hyperbole'))||(userInput.includes('what is an hyperbole'))) {
     response = `Definition: An exaggerated statement not meant to be taken literally.
 Example: "I’ve told you a million times."
 Purpose: To emphasize a point or create a strong impression.😊`;
 } else if (userInput.includes('what is the unit of power')) {
     response = 'The unit of power is the Watt (W).😊';
 } else if (userInput.includes('who built you')||(userInput.includes('who is your creator'))||(userInput.includes('who spornsored'))||(userInput.includes('who created you'))) {
     response = `I was created by Nwobodo's family at Amaogwu Umuavulu Abor, an artificial intelligence research Family. My development involved a team of researchers and engineers who designed and trained me using advanced machine learning techniques.`;
 } else if (userInput.includes('define frequency')) {
    response = 'Frequency is the number of occurrences of a repeating event per unit of time.😊';
 } else if (userInput.includes('what is forensic science')) {
    response = `Forensic science is the application of scientific principles and techniques to solve crimes and legal issues. It involves analyzing physical evidence from crime scenes to assist in investigations and legal proceedings. Forensic scientists use various disciplines and methods to gather, preserve, and analyze evidence, and their findings are often used in criminal investigations and court cases.

Key areas of forensic science include:

1. Forensic Biology: Analyzing biological evidence such as blood, hair, and DNA to identify individuals or determine relationships.

2. Forensic Chemistry: Examining chemical substances, including drugs, explosives, and toxins, to identify their composition and relevance to a case.

3. Forensic Toxicology: Studying bodily fluids and tissues to detect the presence of drugs, alcohol, or other substances that may have contributed to a person's death or impairment.

4. Forensic Pathology: Investigating cause of death by examining deceased bodies and conducting autopsies.

5. Forensic Anthropology: Identifying and examining human skeletal remains to determine age, sex, ancestry, and other characteristics, and to help establish identity.

6. Forensic Odontology: Analyzing dental records and bite marks to identify individuals and assess injuries.

7. Forensic Entomology: Using insect evidence to estimate the time of death and other aspects of a crime scene.

8. Digital Forensics: Investigating electronic devices and digital data to uncover evidence related to cybercrimes or other criminal activities.

Forensic scientists work closely with law enforcement agencies, legal professionals, and other experts to ensure that evidence is accurately analyzed and presented in court.`;
 } else if (userInput.includes('what is forex trading')||(userInput.includes('define forex treding'))) {
    response = `Forex trading, short for "foreign exchange trading," involves buying and selling currencies in the foreign exchange market with the aim of making a profit. 

Here’s a brief overview of forex trading:

1. Currency Pairs: Forex trading involves trading in currency pairs, such as EUR/USD (Euro/US Dollar) or GBP/JPY (British Pound/Japanese Yen). Traders buy one currency while selling another simultaneously.

2. Market Participants: The forex market includes various participants like banks, financial institutions, corporations, governments, and individual traders.

3. Leverage: Forex trading often involves leverage, allowing traders to control a large position with a relatively small amount of capital. This can amplify both potential gains and losses.

4. Market Hours: The forex market operates 24 hours a day, five days a week, making it one of the most accessible financial markets for traders around the world.

5. Technical and Fundamental Analysis: Traders use technical analysis (studying price charts and patterns) and fundamental analysis (examining economic indicators and news events) to make trading decisions.

6. Risk Management: Due to the potential for significant price fluctuations and leverage, managing risk is crucial in forex trading.

If you were referring to something else, like trading related to forests or forestry products, please let me know!`;
 } else if (userInput.includes('teach me forex trading')) {
    response = `Sure, I'd be happy to give you an introduction to forex trading! Here's a basic overview to get you started:

 1. Understanding Forex Trading

- Forex Market: The forex (foreign exchange) market is where currencies are traded. It’s the largest financial market in the world, operating 24 hours a day, five days a week.

- Currency Pairs: Forex trading involves trading currency pairs. For example, EUR/USD means buying euros and selling US dollars. Each currency pair has a bid price (the price at which you can sell) and an ask price (the price at which you can buy).

 2. Basic Terminology

- Pip: The smallest price movement in the forex market. For most currency pairs, it's the fourth decimal place (e.g., 0.0001). 

- Lot: A unit of measurement for the amount of a currency you are trading. Standard lot is 100,000 units of the base currency, mini lot is 10,000, and micro lot is 1,000.

- Leverage: Allows you to control a large position with a relatively small amount of capital. For example, with 100:1 leverage, you can control $100,000 with just $1,000. Leverage can amplify both gains and losses.

 3. Opening a Forex Trading Account

- Choose a Broker: Select a reputable forex broker that suits your needs. Look for factors such as regulation, fees, trading platforms, and customer support.

- Open an Account: Complete the broker’s application process. You’ll need to provide personal information, financial details, and verify your identity.

- Deposit Funds: Fund your trading account with an initial deposit. The minimum amount can vary depending on the broker.

 4. Trading Platforms

- MetaTrader 4 (MT4): A popular trading platform that provides a range of tools for analysis and trading. It supports automated trading through Expert Advisors (EAs).

- MetaTrader 5 (MT5): An updated version of MT4 with more features, including additional timeframes, more indicators, and an economic calendar.

 5. Develop a Trading Strategy

- Technical Analysis: Involves studying price charts and using indicators such as Moving Averages, Relative Strength Index (RSI), and Bollinger Bands to predict future price movements.

- Fundamental Analysis: Involves analyzing economic indicators such as GDP, interest rates, and employment reports to understand the factors driving currency values.

- Risk Management: Set stop-loss orders to limit potential losses and take-profit orders to secure gains. Never risk more than you can afford to lose.

 6. Practice with a Demo Account

- Demo Trading: Most brokers offer demo accounts where you can practice trading with virtual money. This helps you familiarize yourself with the platform and develop your strategy without financial risk.

 7. Start Trading

- Place Trades: Once you're comfortable, you can start trading with real money. Monitor your trades and adjust your strategy as needed.

 8. Continuous Learning

- Stay Informed: Keep up with market news, economic events, and changes in market conditions. Continuous learning and adapting your strategy are key to long-term success.

 Additional Resources

- Books: "Currency Trading for Dummies" by Brian Dolan and "Trading in the Zone" by Mark Douglas.
- Online Courses: Many brokers and educational platforms offer forex trading courses and webinars.

If you have any specific questions or need more detailed information on any of these topics, feel free to ask!`;
 } else if (userInput.includes('what is the unit of frequency')) {
     response = 'The unit of frequency is the Hertz (Hz).😊';
} else if (userInput.includes('what is your creators name')) {
        response = 'My creator\'s name is "EGBUJI DAVID KENECHUKWU" 😊';
} else if (userInput.includes('what is my name')) {
        response = `I don\'t know your name, if you can introduce that`;
 } else if (userInput.includes('what is hooke\'s Law')) {
     response = 'Hooke\'s Law states that the force exerted by a spring is directly proportional to the displacement of the spring.😊';
 } else if (userInput.includes('what is the first law of thermodynamics')) {
     response = 'The first law of thermodynamics states that energy cannot be created or destroyed, only transformed.😊';
 } else if (userInput.includes('what is the second law of thermodynamics')) {
     response = 'The second law of thermodynamics states that the total entropy of an isolated system can never decrease over time.😊';
 } else if (userInput.includes('define electric field')) {
     response = 'An electric field is a region around a charged particle where a force would be exerted on other charged particles.😊';
 } else if (userInput.includes('what is coulomb\'s Law')) {
     response = 'Coulomb\'s Law states that the force between two charged objects is directly proportional to the product of the charges and inversely proportional to the square of the distance between them.';
 } else if (userInput.includes('what is a capacitor')) {
     response = 'A capacitor is a device used to store electrical energy in an electric field.😊';
 } else if (userInput.includes('what is the unit of electric charge')) {
     response = 'The unit of electric charge is the Coulomb (C).😊';
 } else if (userInput.includes('what is fundamental and derived quantitiy')) {
     response = `In physics and other sciences, quantities are classified into two main types: fundamental and derived. Here's a breakdown of each:
 
  Fundamental Quantities
 
 Fundamental quantities (or base quantities) are the basic physical quantities that are not defined in terms of other quantities. They serve as the building blocks from which other quantities are derived. The International System of Units (SI) defines seven fundamental quantities:
 
 1. Length (measured in meters, m)
    - Example: The length of an object.
 
 2. Mass (measured in kilograms, kg)
    - Example: The mass of a sample of material.
 
 3. Time (measured in seconds, s)
    - Example: The duration of an event.
 
 4. Electric Current (measured in amperes, A)
    - Example: The flow of electric charge.
 
 5. Thermodynamic Temperature (measured in kelvin, K)
    - Example: The temperature of a substance.
 
 6. Amount of Substance (measured in moles, mol)
    - Example: The amount of a chemical substance.
 
 7. Luminous Intensity (measured in candelas, cd)
    - Example: The brightness of a light source.
 
  Derived Quantities
 
 Derived quantities are physical quantities that are defined in terms of fundamental quantities. They are obtained by combining fundamental quantities through multiplication, division, or other mathematical operations. Examples of derived quantities include:
 
 1. Speed (measured in meters per second, m/s)
    - Derived from: Length (meters) and Time (seconds).
    - Formula: Speed = Distance / Time
 
 2. Force (measured in newtons, N)
    - Derived from: Mass (kilograms) and Acceleration (meters per second squared).
    - Formula: Force = Mass × Acceleration
 
 3. Pressure (measured in pascals, Pa)
    - Derived from: Force (newtons) and Area (square meters).
    - Formula: Pressure = Force / Area
 
 4. Energy (measured in joules, J)
    - Derived from: Force (newtons) and Distance (meters).
    - Formula: Energy = Force × Distance
 
 5. Density (measured in kilograms per cubic meter, kg/m³)
    - Derived from: Mass (kilograms) and Volume (cubic meters).
    - Formula: Density = Mass / Volume
 
 6. Work (measured in joules, J)
    - Derived from: Force (newtons) and Distance (meters).
    - Formula: Work = Force × Distance
 
 7. Power (measured in watts, W)
    - Derived from: Energy (joules) and Time (seconds).
    - Formula: Power = Energy / Time😊`;
 } else if (userInput.includes('what is family') ||(userInput.includes('define family'))) {
     response = `A family is a social unit consisting of individuals who are related by blood, marriage, or adoption. Families provide emotional support, socialization, and a sense of identity. The concept of family can vary widely across cultures and societies, but it generally includes the following forms:😊`;
 } else if (userInput.includes('what is fundamental quantity') ||(userInput.includes('define fundamental quantity'))) {
     response = `A fundamental quantity is a basic physical quantity that is not defined in terms of other quantities. It is a primary measurement that forms the basis for other, derived quantities in a system of measurement. Fundamental quantities are essential for defining and understanding physical laws and are used as the foundation for more complex measurements.
 
 In the International System of Units (SI), the fundamental quantities are associated with specific base units.`;
 } else if (userInput.includes('what is derived quantity') ||(userInput.includes('define derived quantity'))) {
     response = `A derived quantity is a physical quantity that is defined based on the combination of fundamental quantities. Unlike fundamental quantities, which are basic and independent, derived quantities are calculated using mathematical relationships between fundamental quantities. These quantities provide a more detailed description of physical phenomena by combining the basic measurements.`;
 } else if (userInput.includes('what is love') ||(userInput.includes('define love'))) {
     response = `Love is a complex and multifaceted emotional and psychological experience that encompasses a range of feelings, behaviors, and attitudes toward others. It is a central theme in human relationships and has been studied and expressed in various ways across cultures, philosophies, and disciplines. `;
 } else if (userInput.includes('what are the attribute of hatred') ||(userInput.includes('attribute of hatred'))) {
     response = `Hatred is a strong and intense emotion characterized by deep-seated aversion, hostility, or animosity toward someone or something. It is often marked by negative feelings and destructive behavior. Here are some key attributes and characteristics of hatred:
 
 Attributes of Hatred
 Intense Emotion:
 
 Description: Hatred involves a profound and consuming negative emotional response. It can dominate one's thoughts and feelings, leading to significant distress.
 Hostility:
 
 Description: Hatred often manifests as hostility or aggression towards the object of hate. This can include verbal attacks, physical aggression, or other forms of antagonistic behavior.
 Resentment:
 
 Description: Hatred is frequently accompanied by deep-seated resentment. This resentment can stem from perceived wrongs, injustices, or personal grievances.
 Destructive Intent:
 
 Description: Hatred may drive individuals to seek to harm or undermine the object of their hatred. This destructive intent can lead to harmful actions or behaviors.
 Prejudice and Bias:
 
 Description: Hatred can be based on prejudice or bias against particular groups or individuals. It often involves irrational or unfounded beliefs that fuel negative feelings.
 Dehumanization:
 
 Description: Hatred can lead to the dehumanization of the target, where the person or group is seen as less than human or undeserving of empathy and respect.
 Persistence:
 
 Description: Hatred is often a persistent emotion that can last for a long time. It can be difficult to overcome and may continue to affect one's behavior and relationships.
 Influence on Behavior:
 
 Description: Hatred can influence behavior in harmful ways, such as encouraging violence, discrimination, or other negative actions towards the object of hatred.
 Polarization:
 
 Description: Hatred can contribute to polarization, where individuals or groups become divided into opposing factions, leading to conflict and reduced willingness to engage in constructive dialogue.
 Impact on Well-being:
 
 Description: Experiencing or harboring hatred can negatively impact one's mental and emotional well-being. It can lead to increased stress, anxiety, and a diminished quality of life.`;
 } else if (userInput.includes('what are the attribute of love') ||(userInput.includes('attribute of love'))) {
     response = `Love is a complex and multifaceted emotion that can be experienced in many different forms, such as romantic love, familial love, platonic love, and self-love. Here are some key attributes commonly associated with love:
 
  1.Compassion and Empathy:
    -Compassion: Feeling a deep sense of care and concern for another person's well-being.
    -Empathy: The ability to understand and share the feelings of another person, putting oneself in their shoes.
 
  2.Trust and Honesty:
    -Trust: Believing in the reliability, integrity, and character of a person.
    -Honesty: Being truthful and transparent in communication, fostering trust and security in the relationship.
 
  3.Respect and Appreciation:
    -Respect: Valuing the other person’s opinions, feelings, and boundaries.
    -Appreciation: Recognizing and valuing the other person's qualities and actions.
 
  4.Commitment and Loyalty:
    -Commitment: A dedicated and enduring attachment to another person, often involving a promise to support and care for them.
    -Loyalty: Being faithful and devoted to a person, maintaining allegiance through challenges and time.
 
  5.Patience and Understanding:
    -Patience: The ability to remain calm and tolerant, giving the relationship time to grow and allowing for mistakes.
    -Understanding: The willingness to listen and comprehend the other person’s perspective and experiences.
 
  6.Selflessness and Sacrifice:
    -Selflessness: Putting the needs and happiness of the other person above one’s own at times.
    -Sacrifice: Willingness to give up something valuable for the benefit of the other person or the relationship.
 
  7.Affection and Intimacy:
    -Affection: Showing warmth and care through physical touch, words, and actions.
    -Intimacy: Creating a deep and personal connection, sharing one’s inner thoughts and feelings.
 
  8.Support and Encouragement:
    -Support: Providing emotional, moral, or physical help during good times and bad.
    -Encouragement: Motivating and inspiring the other person to pursue their goals and aspirations.
 
  9.Forgiveness and Acceptance:
    -Forgiveness: Letting go of grudges and resentment, allowing for healing and moving forward.
    -Acceptance: Embracing the other person as they are, with all their strengths and imperfections.
 
  10.Joy and Shared Happiness:
    -Joy: Finding happiness and delight in the presence and achievements of the other person.
    -Shared Happiness: Celebrating and experiencing life’s moments together, creating mutual joy.
 
  Summary:
 
 Love encompasses a range of positive emotions and behaviors that foster deep connections and meaningful relationships. These attributes contribute to building strong, healthy, and fulfilling relationships, whether they are romantic, familial, platonic, or self-directed.`;
 } else if (userInput.includes('who is the president of nigeria') ||(userInput.includes('what is the name of the president of nigeria'))) {
     response = `the resent president of nigeria nigeria is "Tinibu"`;
 } else if (userInput.includes('what is pollutant') ||(userInput.includes('define pollutant'))) {
     response = `A pollutant is a substance that contaminates the environment, causing adverse effects on health, ecosystems, and the overall quality of natural resources. Pollutants can originate from various sources and exist in multiple forms, including solids, liquids, gases, and energy. They are typically categorized based on their nature, sources, and effects.`;
 } else if (userInput.includes('what is economics') ||(userInput.includes('define economics'))) {
     response = `Economics is the social science that studies how people, businesses, governments, and nations make choices about allocating limited resources to meet their needs and desires. It involves analyzing the production, distribution, and consumption of goods and services. The field of economics can be divided into two main branches:
 
  1. Microeconomics:
    - Focus: Examines the behavior of individual consumers, firms, and markets.
    - Key Concepts:
      - Supply and Demand: Analyzes how the quantity of goods and services demanded by consumers interacts with the quantity supplied by producers to determine prices.
      - Elasticity: Measures how responsive the quantity demanded or supplied of a good is to changes in price or other factors.
      - Consumer Choice: Studies how individuals make decisions to maximize their utility or satisfaction.
      - Production and Costs: Examines how firms make production decisions and manage costs to maximize profits.
 
  2. Macroeconomics:
    - Focus: Looks at the economy as a whole, including large-scale economic factors and national or global economic issues.
    - Key Concepts:
      - Gross Domestic Product (GDP): Measures the total value of all goods and services produced in an economy over a specific period.
      - Inflation: Examines the rate at which the general level of prices for goods and services is rising and purchasing power is falling.
      - Unemployment: Analyzes the levels and types of unemployment within an economy and its effects.
      - Monetary Policy: Involves the management of a country’s money supply and interest rates by the central bank to control inflation and stabilize the currency.
      - Fiscal Policy: Refers to government spending and tax policies used to influence economic conditions.
 
  Other Key Areas in Economics:
 
 - International Economics: Studies trade between countries, exchange rates, and the effects of globalization.
 - Development Economics: Focuses on improving economic conditions in developing countries and addressing issues like poverty and inequality.
 - Behavioral Economics: Explores how psychological factors and behavioral biases influence economic decisions.
 
  Importance of Economics:
 
 - Decision Making: Helps individuals, businesses, and governments make informed decisions by analyzing costs, benefits, and trade-offs.
 - Policy Formulation: Assists in crafting policies to address economic issues such as unemployment, inflation, and economic growth.
 - Resource Allocation: Provides insights into the efficient allocation of scarce resources to maximize societal welfare.
 
 In summary, economics is the study of how resources are allocated in a world of scarcity, aiming to understand and improve how people and societies make choices to enhance their well-being and economic efficiency.`;
 } else if (userInput.includes(`what is snarks'`) ||(userInput.includes(`definesnarks'`))) {
     response = `"Snarks" generally refers to creatures or entities in different contexts, such as literature, games, and technology. Here are some of the notable uses:
 
  1. Literature:
    - The Snark: In Lewis Carroll's poem "The Hunting of the Snark" (1876), a Snark is a fictional creature. The poem is a nonsensical narrative about a quest to find this elusive and mysterious being. The nature of the Snark is intentionally ambiguous and open to interpretation.
 
  2. Mathematics and Computer Science:
    - SNARKs (Succinct Non-interactive Arguments of Knowledge): In the realm of cryptography and computer science, SNARKs are a type of cryptographic proof that allows one party to prove to another that a statement is true without revealing any additional information. SNARKs are particularly useful in blockchain technologies and privacy-focused systems.
      - Succinct: The proof is small in size and quick to verify.
      - Non-interactive: The proof process requires only a single message from the prover to the verifier.
      - Arguments of Knowledge: The proof assures the verifier that the prover possesses certain knowledge without disclosing the knowledge itself.
 
  Summary:
 
 - Literary Snark: A whimsical and enigmatic creature from Lewis Carroll's poetry.
 - Cryptographic SNARKs: Advanced mathematical proofs used in computer science to validate statements efficiently and securely.
 
 The context in which "snarks" is used determines its meaning, whether referring to a literary creation or a sophisticated cryptographic concept.`;
 } else if (userInput.includes('what are the out put device of computer') ||(userInput.includes(`show me  out put device of computer`))) {
     response = `Output devices are hardware components that display or provide the results of computer processing to the user. They take data from the computer and convert it into a form that is understandable or usable. Here are some common output devices:
 
  1. Monitor:
    - Function: Displays visual output from the computer, including text, images, and videos.
    - Types: LCD (Liquid Crystal Display), LED (Light Emitting Diode), OLED (Organic Light Emitting Diode).
 
  2. Printer:
    - Function: Produces hard copies of documents, images, or graphics on paper.
    - Types: Inkjet printers, laser printers, dot matrix printers, thermal printers.
 
  3. Speakers:
    - Function: Output audio from the computer, including music, sound effects, and spoken content.
    - Types: Built-in speakers, external speakers, soundbars.
 
  4. Headphones:
    - Function: Provide personal audio output directly to the user, used for listening to music, audio recordings, or communication.
    - Types: Wired headphones, wireless headphones, noise-canceling headphones.
 
  5. Projector:
    - Function: Projects visual output onto a large screen or surface, used for presentations, movies, and other displays.
    - Types: DLP (Digital Light Processing), LCD projectors, laser projectors.
 
  6. Plotter:
    - Function: Produces large-scale graphics and technical drawings, often used in engineering and design.
    - Types: Inkjet plotters, laser plotters.
 
  7. Virtual Reality (VR) Headsets:
    - Function: Provide immersive visual and audio experiences for gaming, simulations, and virtual environments.
    - Types: Standalone VR headsets, tethered VR headsets.
 
  8. Haptic Devices:
    - Function: Provide tactile feedback or simulate physical sensations, used in specialized applications like simulations and gaming.
    - Types: Haptic gloves, force feedback controllers.
 
  9. Braille Displays:
    - Function: Convert text into braille for visually impaired users, allowing them to read electronic text via tactile feedback.
 
  10. LED/LCD Displays (Digital Signage):
    - Function: Provide information, advertisements, or other visual content in public spaces, often in a large-format display.
 
  Summary:
 
 Output devices are essential for translating the digital data processed by a computer into formats that users can perceive and interact with, such as visual images, printed documents, and audio. They enhance the usability and functionality of computer systems by providing various ways to present and interact with information.`;
 } else if (userInput.includes('what is nature') ||(userInput.includes('define nature'))) {
     response = `Nature refers to the physical world and its phenomena, including the living and non-living components that make up the environment. It encompasses everything from the smallest microorganisms to the vast ecosystems and physical processes that shape the planet. Here are key aspects of nature:
 
  1. Natural Elements:
    - Living Organisms: Includes plants, animals, fungi, and microorganisms that make up the biosphere.
    - Non-Living Components: Includes water, air, minerals, rocks, and soil that constitute the Earth's physical environment.
 
  2. Natural Processes:
    - Ecosystem Dynamics: Processes such as photosynthesis, nutrient cycling, and ecological interactions that sustain life and ecosystems.
    - Geological Processes: Includes phenomena like erosion, volcanic activity, and tectonic movements that shape the Earth's surface.
 
  3. Biodiversity:
    - Variety of Life Forms: The diversity of species, genes, and ecosystems that contribute to ecological balance and resilience.
    - Conservation: Efforts to protect and preserve natural habitats and species to maintain ecological balance and biodiversity.
 
  4. Natural Resources:
    - Renewable Resources: Resources that can be replenished naturally over time, such as sunlight, wind, and water.
    - Non-Renewable Resources: Resources that are finite and cannot be replenished on a human time scale, such as fossil fuels and minerals.
 
  5. Human Interaction:
    - Impact and Use: The ways in which humans interact with and use natural resources, including agriculture, industry, and urbanization.
    - Sustainability: Efforts to use natural resources responsibly and ensure that future generations can also benefit from them.
 
  6. Aesthetics and Recreation:
    - Natural Beauty: The scenic and aesthetic qualities of landscapes, such as mountains, forests, and oceans.
    - Recreational Activities: Activities such as hiking, camping, and birdwatching that people engage in to connect with and enjoy the natural world.
 
  7. Philosophical and Spiritual Aspects:
    - Nature in Philosophy: The concept of nature can also encompass philosophical and spiritual ideas about the essence and order of the natural world and humanity’s place within it.
 
  Summary:
 
 Nature is a comprehensive term that includes all aspects of the physical world, from living organisms to natural processes and resources. It reflects the interconnectedness of ecosystems and the importance of maintaining a balance between human activities and the environment. Understanding and appreciating nature is essential for promoting sustainability, conservation, and overall well-being.`;
 } else if (userInput.includes('why is water a polar solvent') ||(userInput.includes('why is water regarded as a polar solvent'))) {
     response = `Water is regarded as a polar solvent due to its molecular structure and the resulting distribution of electrical charge. Here’s why water is classified as a polar solvent:
 
  1. Molecular Structure:
    - Bent Shape: The water molecule (H₂O) has a bent or V-shaped structure. The oxygen atom is at the center, with two hydrogen atoms attached at an angle of about 104.5 degrees.
    - Electronegativity: Oxygen is more electronegative than hydrogen, meaning it has a stronger tendency to attract electrons.
 
  2. Polarity:
    - Uneven Distribution of Charge: The oxygen atom pulls the shared electrons in the O-H bonds closer to itself, creating a partial negative charge (δ-) on the oxygen atom and partial positive charges (δ+) on the hydrogen atoms.
    - Dipole Moment: The molecule has a net dipole moment because the positive and negative charges are not evenly distributed. The oxygen end of the molecule is slightly negative, while the hydrogen ends are slightly positive.
 
  3. Solvent Properties:
    - Hydration: Water molecules can surround and interact with various substances. The partial positive and negative charges on water molecules attract ions and polar molecules, facilitating their dissolution.
    - Ion Dissolution: Water effectively dissolves ionic compounds (e.g., table salt) by separating the ions and surrounding them with water molecules, which stabilizes the ions in solution.
    - Polar Solutes: Water also dissolves other polar substances (e.g., sugars) through similar interactions, where the polar water molecules surround and interact with the polar solute molecules.
 
  4. Hydrogen Bonding:
    - Intermolecular Forces: Water molecules form hydrogen bonds with each other due to the attraction between the partial positive charge on hydrogen atoms and the partial negative charge on oxygen atoms of neighboring molecules.
    - Solvent Strength: These hydrogen bonds contribute to water’s high boiling point and its ability to dissolve a wide range of substances.
 
  Summary:
 
 Water is considered a polar solvent because its molecules have a bent shape, resulting in an uneven distribution of electrical charge. This polarity allows water to interact with and dissolve many ionic and polar substances, making it an effective solvent for a wide range of chemical reactions and biological processes.`;
 } else if (userInput.includes('what is hard water') ||(userInput.includes('define hard water'))) {
     response = `Hard water is water that contains a high concentration of dissolved minerals, primarily calcium (Ca²⁺) and magnesium (Mg²⁺) ions. These minerals are typically present as a result of water percolating through limestone, gypsum, or other mineral-rich geological formations.
 
  Key Characteristics of Hard Water:
 
 1.Mineral Content:
    -Calcium and Magnesium: The primary contributors to water hardness. They form salts that dissolve in water.
    -Other Minerals: May include bicarbonates, sulfates, and chlorides.
 
 2.Types of Hard Water:
    -Temporary Hard Water: Caused by dissolved bicarbonates (e.g., calcium bicarbonate). It can be softened by boiling, which precipitates the bicarbonates as carbonate salts.
    -Permanent Hard Water: Caused by dissolved sulfates and chlorides (e.g., calcium sulfate, magnesium chloride). It cannot be softened by boiling and requires chemical treatment.
 
  Effects of Hard Water:
 
 1.Scaling:
    -Mineral Deposits: Hard water can cause limescale buildup in pipes, boilers, and appliances, reducing their efficiency and lifespan.
    -Heating Elements: Scales can form on heating elements in water heaters and kettles.
 
 2.Soap and Detergent Interaction:
    -Reduced Effectiveness: Hard water can react with soap to form insoluble salts, leading to soap scum and reducing the effectiveness of cleaning agents.
    -Increased Soap Use: More soap or detergent may be needed to achieve the desired lather and cleaning performance.
 
 3.Skin and Hair:
    -Dryness: Hard water can leave a film on skin and hair, potentially leading to dryness or irritation.
    -Hair: May affect hair texture and make it feel less soft or manageable.
 
 4.Appliance Efficiency:
    -Energy Consumption: Hard water deposits can insulate heating elements, leading to higher energy consumption for heating water.
    -Maintenance: Increased maintenance costs for cleaning and descaling appliances.
 
  Solutions to Hard Water:
 
 1.Water Softeners:
    -Ion Exchange: Use resin beads to replace calcium and magnesium ions with sodium or potassium ions.
    -Effectiveness: Efficient at reducing water hardness and preventing scale buildup.
 
 2.Descaling Agents:
    -Chemical Treatments: Use acids or other chemicals to remove existing scale from appliances and plumbing systems.
 
 3.Boiling:
    -Temporary Hard Water: Boiling can precipitate out bicarbonate ions, but it does not work for permanent hardness.
 
 4.Reverse Osmosis:
    -Filtration: Uses a semi-permeable membrane to remove dissolved minerals from water.
 
  Conclusion:
 
 Hard water is a common issue that can affect various aspects of daily life, from household appliances to personal care. Understanding its effects and applying appropriate treatment methods can help mitigate the problems associated with hard water.`;
 } else if (userInput.includes('types of mixture') ||(userInput.includes('what are the types of mixture'))) {
     response = `Mixtures can be categorized into two main types based on their composition and appearance:
 
  1. Homogeneous Mixtures:
    - Definition: Mixtures with a uniform composition throughout. The individual components are indistinguishable from one another.
    - Characteristics:
      - Single Phase: Appears as a single phase (solid, liquid, or gas).
      - Uniformity: Components are evenly distributed at the molecular level.
    - Examples:
      - Solutions: Salt dissolved in water, sugar dissolved in tea.
      - Alloys: Brass (copper and zinc), steel (iron and carbon).
      - Gases: Air (a mixture of nitrogen, oxygen, and other gases).
 
  2. Heterogeneous Mixtures:
    - Definition: Mixtures where the individual components are distinguishable and not evenly distributed. The composition varies from one part of the mixture to another.
    - Characteristics:
      - Multiple Phases: Can consist of more than one phase (solid, liquid, or gas).
      - Distinct Parts: Components can be visibly distinguished or separated by physical means.
    - Examples:
      - Suspensions: Sand in water, where solid particles are dispersed in a liquid.
      - Colloids: Milk (a mixture of fat globules in water), fog (tiny water droplets in air).
      - Mechanical Mixtures: Salad (various vegetables and ingredients), gravel (a mix of stones and pebbles).
 
  Additional Notes:
 
 - Solutions are a subset of homogeneous mixtures where one substance (the solute) is dissolved in another (the solvent).
 - Suspensions are a type of heterogeneous mixture where solid particles are dispersed in a liquid or gas but eventually settle out.
 - Colloids are mixtures where particles are dispersed throughout another substance, but are not heavy enough to settle out.
 
 Understanding the types of mixtures is essential for various applications in science and industry, including chemistry, materials science, and environmental science.`;
 } else if (userInput.includes('what is mixture') ||(userInput.includes('define mixture'))) {
     response = `A mixture is a physical combination of two or more substances where each substance retains its own chemical properties. Unlike compounds, mixtures do not involve chemical bonding between the components, and they can often be separated by physical means.`;
 } else if (userInput.includes('what is compound') ||(userInput.includes('define compound'))) {
     response = `A compound is a substance composed of two or more different elements chemically bonded together in fixed proportions. The properties of a compound are distinct from those of its individual elements.`;
 } else if (userInput.includes('what is radicals') ||(userInput.includes('define radicals'))) {
     response = `1. Chemistry:
 Chemical Radicals: Also known as free radicals, these are atoms, molecules, or ions with unpaired electrons, making them highly reactive. They play a crucial role in many chemical reactions and processes.
 Examples: Hydroxyl radical (•OH), nitric oxide (NO).
 Importance: Free radicals are involved in combustion, polymerization, and can also contribute to oxidative stress in biological systems.`;
 } else if (userInput.includes('what is advertising') ||(userInput.includes('define advertising'))) {
     response = `Advertising is the practice of promoting products, services, or ideas to a target audience through various media channels. Its primary goal is to influence consumer behavior and encourage the purchase or adoption of the advertised product or service`;
 } else if (userInput.includes('important of agriculture') ||(userInput.includes(`list  importance of agriculture`))) {
     response = `Agriculture plays a crucial role in society and the economy. Here’s an overview of its importance:
 
  1.Food Security:
 -Primary Food Source: Provides the essential food products that sustain human life, including grains, vegetables, fruits, and animal products.
 -Hunger Prevention: Ensures a steady and reliable food supply, which is vital for preventing hunger and malnutrition.
 
  2.Economic Impact:
 -Employment: Generates jobs for millions globally, especially in rural areas.
 -Income: Contributes significantly to the income of farmers and agribusinesses.
 -Trade: Plays a major role in international trade, with many countries relying on agricultural exports.
 
  3.Rural Development:
 -Infrastructure: Supports the development of rural infrastructure such as roads, markets, and storage facilities.
 -Community Growth: Stimulates economic activities and improves the quality of life in rural communities.
 
  4.Cultural Significance:
 -Traditions: Embedded in cultural traditions, festivals, and rituals.
 -Knowledge: Preserves traditional farming knowledge and practices.
 
  5.Environmental Benefits:
 -Soil Health: Responsible land management improves soil fertility and prevents erosion.
 -Biodiversity: Sustainable practices support diverse ecosystems and wildlife.
 
  6.Economic Multiplier Effect:
 -Supply Chain: Supports industries like food processing, transportation, and retail.
 -Innovation: Drives advancements in agricultural technology and practices.
 
  7.Health Benefits:
 -Nutrition: Provides essential nutrients and supports diverse diets.
 -Disease Prevention: Helps prevent malnutrition and related health issues.
 
  8.Energy Production:
 -Biofuels: Produces renewable energy sources such as ethanol and biodiesel from crops.
 -Sustainable Practices: Promotes the use of renewable energy and reduces reliance on fossil fuels.
 
  9.Climate Regulation:
 -Carbon Sequestration: Agricultural practices can sequester carbon dioxide and help mitigate climate change.
 -Water Management: Encourages sustainable water use and conservation.
 
  10.Economic Resilience:
 -Economic Stability: Contributes to economic stability by providing essential goods and services.
 -Disaster Recovery: Plays a role in recovery efforts following natural disasters or economic downturns.
 
 In summary, agriculture is fundamental to human survival, economic prosperity, environmental sustainability, and cultural heritage. It underpins many aspects of daily life and global trade, making it essential for the well-being of societies worldwide.`;
 } else if (userInput.includes('importance of mineral resources') ||(userInput.includes(`list  importance of mineral resources`))) {
     response = `Mineral resources are crucial for a variety of reasons, playing a significant role in economic development, technological advancement, and daily life. Here are some key points highlighting their importance:
 
 
      1. Economic Development:
 - Industrial Growth: Minerals are essential raw materials for numerous industries, including construction, manufacturing, and technology.
 - Employment: Mining and processing of minerals create jobs and contribute to the economic stability of regions.
 - Revenue Generation: Export of minerals is a major source of income for many countries.
 
 
  2. Technological Advancement:
 - Electronics: Minerals like silicon, copper, and rare earth elements are critical components in electronic devices such as smartphones, computers, and televisions.
 - Renewable Energy: Minerals are used in the production of renewable energy technologies, including solar panels (silicon) and wind turbines (rare earth elements).
 - Innovation: Advanced materials derived from minerals enable new technologies and improvements in existing ones.
 
 
  3. Infrastructure and Construction:
 - Building Materials: Minerals like limestone, gypsum, and sand are essential for producing cement, plaster, and concrete, which are fundamental for construction.
 - Transportation: Minerals are used in the construction of roads, bridges, railways, and airports.
 
 
  4. Energy Production:
 - Fossil Fuels: Coal, oil, and natural gas are primary sources of energy for electricity generation, heating, and transportation.
 - Nuclear Power: Uranium is used as a fuel in nuclear power plants to produce electricity.
 
 
  5. Agriculture:
 - Fertilizers: Minerals such as phosphates and potash are key ingredients in fertilizers that enhance soil fertility and crop yield.
 - Soil Amendments: Minerals can improve soil structure and nutrient availability.
 
 
  6. Healthcare:
 - Medicines: Minerals like magnesium and sulfur are used in pharmaceuticals.
 - Medical Equipment: Minerals are essential in the production of medical devices and diagnostic equipment.
 
 
  7. Everyday Products:
 - Household Items: Minerals are found in a wide range of household products, including cookware (aluminum), plumbing (copper), and cleaning agents (sodium compounds).
 - Cosmetics: Minerals are used in the formulation of cosmetics and personal care products.
 
 
  8. Environmental and Sustainability Initiatives:
 - Recycling: Minerals can be recycled and reused, reducing the need for new extraction and minimizing environmental impact.
 - Environmental Remediation: Certain minerals are used in processes to clean up and restore polluted environments.
 
 
  Conclusion:
 Mineral resources are indispensable for modern civilization, contributing to economic growth, technological progress, infrastructure development, and improved quality of life. Sustainable management and responsible use of these resources are crucial for ensuring their availability for future generations.`;
 } else if (userInput.includes('what is agriculture') ||(userInput.includes('define agriculture'))) {
     response = `Agriculture is the practice of cultivating soil, growing crops, and raising animals for food, fiber, medicinal plants, and other products used to sustain and enhance human life. It involves various activities such as planting, harvesting, breeding, and managing livestock, as well as using techniques and tools to improve productivity and sustainability.`;
 } else if (userInput.includes('what is element') ||(userInput.includes('define element'))) {
     response = `An element is a fundamental substance that cannot be broken down into simpler substances by chemical means. Elements are the basic building blocks of matter, and each element is defined by the number of protons in its atomic nucleus. Here are the key characteristics and details about elements:
 
 
      Characteristics of Elements:
 
 1. Atomic Number:
    - The number of protons in the nucleus of an atom, which uniquely identifies an element.
    - For example, hydrogen has an atomic number of 1, meaning it has one proton.
 
 2. Symbol:
    - Each element is represented by a one- or two-letter symbol, usually derived from its English or Latin name.
    - For example, the symbol for carbon is C, and the symbol for sodium (from the Latin "natrium") is Na.
 
 3. Atomic Structure:
    - Elements consist of atoms, each containing a nucleus of protons and neutrons, surrounded by electrons in various energy levels.
    - The arrangement of electrons determines the chemical properties of the element.
 
 4. Pure Substance:
    - Elements are pure substances made up of only one type of atom.
    - They can exist as individual atoms (e.g., noble gases like helium) or molecules (e.g., O₂ for oxygen).
 
 
     Classification of Elements:
 
 1. Metals:
    - Good conductors of heat and electricity.
    - Malleable, ductile, and often have a shiny appearance.
    - Examples: Iron (Fe), Copper (Cu), Gold (Au).
 
 2. Non-metals:
    - Poor conductors of heat and electricity.
    - Can be gases, liquids, or brittle solids.
    - Examples: Carbon (C), Nitrogen (N), Sulfur (S).
 
 3. Metalloids:
    - Have properties intermediate between metals and non-metals.
    - Often used in semiconductors and electronic devices.
    - Examples: Silicon (Si), Arsenic (As).
 
 
     The Periodic Table:
 
 - Organization:
   - Elements are organized in the periodic table based on their atomic number.
   - The table is arranged in rows (periods) and columns (groups or families) that highlight periodic trends in properties.
 
 - Groups:
   - Elements in the same column (group) have similar chemical properties.
   - Examples: Group 1 (alkali metals), Group 17 (halogens), Group 18 (noble gases).
 
 - Periods:
   - Elements in the same row (period) have the same number of electron shells.
   - Properties change progressively across a period.
 
 
    Examples of Elements:
 
 - Hydrogen (H):
   - The lightest and most abundant element in the universe.
   - Used in fuel cells and as a reducing agent in chemical reactions.
 
 - Oxygen (O):
   - Essential for respiration in most living organisms.
   - Makes up about 21% of the Earth's atmosphere.
 
 - Iron (Fe):
   - A key component of steel and vital for construction and manufacturing.
   - Found in hemoglobin, the protein that carries oxygen in blood.
 
 - Gold (Au):
   - A precious metal used in jewelry, electronics, and as an investment.
   - Known for its resistance to corrosion and electrical conductivity.
 
 
    Importance of Elements:
 
 1. Chemistry:
    - Elements are the foundation of chemical reactions and compounds.
    - Understanding elements is crucial for studying and applying chemistry.
 
 2. Biology:
    - Elements like carbon, hydrogen, nitrogen, and oxygen are essential for life.
    - Trace elements (e.g., iron, zinc) are vital for biological processes.
 
 3. Industry and Technology:
    - Elements are used in various industries for manufacturing, construction, and technology.
    - Innovations in materials science and engineering often rely on specific elements.
 
 
     Conclusion:
 
 Elements are fundamental substances that compose all matter. Their unique properties and interactions form the basis of chemistry and are essential to various fields of science, technology, and industry. Understanding elements and their behavior is crucial for advancements in numerous areas, from medicine to materials science.`;
 } else if (userInput.includes('what is operation') ||(userInput.includes('define operation'))) {
     response = `An operation is a specific process or action performed to achieve a particular result, often involving a series of steps or procedures. This term can be applied in various contexts, such as mathematical operations, medical procedures, military actions, or business activities.`;
 } else if (userInput.includes('what is mineral recourses') ||(userInput.includes('define mineral recourses '))) {
     response = `Mineral resources are naturally occurring substances found in the Earth's crust that can be extracted and used for various economic purposes. These resources include a wide range of materials that are essential for construction, manufacturing, energy production, and other industrial activities.
 
  Key Characteristics of Mineral Resources:
 
 1. Natural Occurrence:
    - Found naturally in the Earth's crust, often in concentrated deposits.
    - Formed through geological processes over millions of years.
 
 2. Extractability:
    - Can be extracted using various mining and drilling techniques.
    - Economically viable to extract and process.
 
 3. Utility:
    - Have specific properties that make them useful for industrial, commercial, and technological applications.
 
  Types of Mineral Resources:
 
 1. Metallic Minerals:
    - Ferrous Minerals: Contain iron (e.g., iron ore, manganese).
    - Non-Ferrous Minerals: Do not contain iron (e.g., copper, gold, silver, aluminum).
 
 2. Non-Metallic Minerals:
    - Industrial Minerals: Used in manufacturing and industry (e.g., limestone, gypsum, salt, silica).
    - Gemstones: Precious stones used in jewelry (e.g., diamonds, emeralds, sapphires).
 
 3. Energy Minerals:
    - Fossil Fuels: Used for energy production (e.g., coal, oil, natural gas).
    - Nuclear Minerals: Used for nuclear energy (e.g., uranium, thorium).
 
  Examples of Mineral Resources:
 
 - Iron Ore: Used to make steel, essential for construction and manufacturing.
 - Copper: Used in electrical wiring, plumbing, and electronics.
 - Gold: Used in jewelry, electronics, and as an investment.
 - Bauxite: The primary ore of aluminum, used in packaging, transportation, and construction.
 - Coal: Used as a fuel for power generation and industrial processes.
 - Phosphate Rock: Used in fertilizers for agriculture.
 
  Importance of Mineral Resources:
 
 1. Economic Development:
    - Crucial for the industrial growth and economic development of a country.
    - Provide raw materials for various industries, contributing to GDP and employment.
 
 2. Technological Advancement:
    - Essential for the production of technological devices, infrastructure, and transportation systems.
    - Drive innovation in sectors such as electronics, aerospace, and renewable energy.
 
 3. Energy Production:
    - Vital for energy security and powering economies.
    - Fossil fuels and nuclear minerals are major sources of energy.
 
 4. Infrastructure and Construction:
    - Building materials like cement, steel, and glass rely on mineral resources.
    - Enable the development of buildings, roads, bridges, and other infrastructure.
 
  Environmental and Social Considerations:
 
 1. Sustainability:
    - Ensuring that the extraction and use of mineral resources are sustainable and minimize environmental impact.
    - Practices like recycling and using alternative materials can help conserve mineral resources.
 
 2. Environmental Impact:
    - Mining and drilling activities can cause environmental degradation, including habitat destruction, water pollution, and soil erosion.
    - Efforts are needed to mitigate these impacts through regulations and sustainable practices.
 
 3. Social Impact:
    - Mineral resource extraction can affect local communities, leading to displacement and social issues.
    - Responsible mining practices and community engagement are crucial for addressing these concerns.
 
  Conclusion:
 
 Mineral resources are essential for modern society, underpinning economic development, technological progress, and daily life. Balancing their extraction and use with environmental sustainability and social responsibility is critical for ensuring their benefits for future generations.`;
 } else if (userInput.includes('what is salt') ||(userInput.includes('define salt'))) {
     response = `Salt, scientifically known as sodium chloride (NaCl), is a crystalline mineral that is essential for life and widely used in cooking and food preservation. Here are some key aspects of salt:
 
  Chemical Composition:
 - Sodium (Na): An essential electrolyte for bodily functions.
 - Chloride (Cl): Another essential electrolyte, playing a crucial role in maintaining fluid balance and aiding digestion.
 
  Types of Salt:
 1. Table Salt:
    - Refined Salt: Commonly used in households, often contains added iodine (iodized salt) to prevent iodine deficiency.
    - Fine Granules: Processed to remove impurities and usually has anti-caking agents added.
 
 2. Sea Salt:
    - Harvested from Evaporated Seawater: Contains trace minerals that can affect flavor and color.
    - Coarse or Fine: Available in different textures.
 
 3. Kosher Salt:
    - Larger Crystals: Coarser texture, used in cooking and koshering meat.
    - Pure Salt: Usually free of additives and iodine.
 
 4. Himalayan Pink Salt:
    - Mined from Salt Deposits in Pakistan: Contains trace minerals like iron, which gives it a pink color.
    - Gourmet Use: Often used for its unique flavor and aesthetic appeal.
 
 5. Celtic Sea Salt:
    - Harvested from Coastal Areas in France: Known for its grey color and moisture content.
    - Rich in Minerals: Contains a variety of trace minerals.
 
 6. Flake Salt:
    - Light, Flaky Texture: Often used as a finishing salt.
    - Distinct Crunch: Enhances the texture of dishes.
 
  Uses of Salt:
 1. Culinary:
    - Flavoring: Enhances the taste of food.
    - Preservation: Inhibits bacterial growth in food preservation methods like curing and pickling.
 
 2. Industrial:
    - De-icing Roads: Lowers the freezing point of water to melt ice.
    - Manufacturing: Used in the production of chemicals, including chlorine and caustic soda.
 
 3. Health and Medicine:
    - Electrolyte Balance: Essential for maintaining proper hydration and nerve function.
    - Medical Treatments: Used in saline solutions for intravenous therapy and wound cleaning.
 
 4. Household:
    - Cleaning Agent: Effective for cleaning and stain removal.
    - Water Softening: Used in water softeners to remove minerals that cause hardness.
 
  Health Considerations:
 - Essential Nutrient: Necessary for bodily functions, including nerve transmission and muscle contraction.
 - Moderation: Excessive intake can lead to health issues like hypertension and cardiovascular disease.
 - Dietary Guidelines: Recommended daily intake varies, but generally, it should be consumed in moderation.
 
 Salt is an indispensable substance with diverse applications, from everyday cooking to industrial uses. Its various forms and types offer unique flavors and properties, making it a versatile and essential element in human life.`;
 } else if (userInput.includes('what are the types of water') ||(userInput.includes('types of water'))) {
     response = `Water can be classified into various types based on its sources, composition, and usage. Here are the main types of water:
 
  Natural Sources:
 1. Surface Water:
    - Rivers and Streams: Freshwater flowing on the Earth's surface.
    - Lakes and Ponds: Still bodies of freshwater.
    - Oceans and Seas: Large bodies of saltwater covering most of the Earth's surface.
 
 2. Groundwater:
    - Aquifers: Underground layers of water-bearing rock or materials from which groundwater can be extracted.
    - Wells: Man-made structures to access groundwater.
 
 3. Rainwater:
    - Water that falls from the atmosphere as precipitation.
 
 4. Glacial and Ice Melt:
    - Water released from melting glaciers and ice caps.
 
  Based on Salinity:
 1. Freshwater:
    - Low salinity, suitable for drinking and most agricultural uses.
    - Found in rivers, lakes, and underground aquifers.
 
 2. Brackish Water:
    - Intermediate salinity, found where freshwater and saltwater mix (e.g., estuaries).
 
 3. Saltwater:
    - High salinity, found in oceans and seas.
    - Not suitable for drinking without desalination.
 
  Based on Treatment and Usage:
 1. Potable Water:
    - Safe for human consumption.
    - Treated to remove contaminants.
 
 2. Non-potable Water:
    - Not safe for drinking, but can be used for other purposes (e.g., irrigation, industrial processes).
 
 3. Distilled Water:
    - Purified by distillation, removing most impurities and minerals.
    - Used in laboratories and medical settings.
 
 4. Deionized Water:
    - Purified by removing ions, used in industrial and laboratory settings.
 
  Specialized Types:
 1. Mineral Water:
    - Contains naturally occurring minerals.
    - Bottled and often consumed for its health benefits.
 
 2. Spring Water:
    - Comes from natural springs, typically rich in minerals.
 
 3. Sparkling Water:
    - Carbonated water with dissolved carbon dioxide gas.
    - Can be natural or artificially carbonated.
 
 4. Hard Water:
    - Contains high levels of dissolved minerals (mainly calcium and magnesium).
    - Can cause scaling in pipes and reduce soap effectiveness.
 
 5. Soft Water:
    - Low in dissolved minerals.
    - Preferred for cleaning and in appliances to avoid scaling.
 
  By Temperature:
 1. Hot Water:
    - Water at elevated temperatures, often used for bathing, cleaning, and industrial processes.
 
 2. Cold Water:
    - Water at lower temperatures, typically used for drinking and cooling purposes.
 
 These classifications help in understanding the various forms and uses of water, which is essential for effective management and conservation of this vital resource.`;
 } else if (userInput.includes('what is prayer') ||(userInput.includes('define prayer'))) {
     response = `Prayer is a spiritual practice that involves communicating with a deity, spirit, or higher power. It is a universal phenomenon found in many religious and spiritual traditions and can take various forms, including spoken or silent words, songs, or meditative practices. Here are some key aspects of prayer:
 
  1. Purpose of Prayer:
    - Communication with the Divine: Seeking a connection with a higher power, expressing devotion, gratitude, or seeking guidance.
    - Petition: Requesting help or intervention for oneself or others, such as for healing, protection, or solutions to problems.
    - Confession: Admitting sins or mistakes and seeking forgiveness.
    - Thanksgiving: Expressing gratitude for blessings, help received, or positive experiences.
    - Adoration: Praising and worshipping the divine for its nature, power, and goodness.
 
  2. Forms of Prayer:
    - Vocal Prayer: Using spoken or sung words to convey messages or feelings.
    - Meditative Prayer: Reflecting deeply and silently, focusing on the divine presence, scripture, or a specific intention.
    - Contemplative Prayer: A form of silent prayer that seeks to experience a deeper connection with the divine presence, often beyond words or specific thoughts.
    - Ritual Prayer: Structured prayers as part of religious rituals and ceremonies, such as liturgies, daily prayers, or special observances.
 
  3. Contexts for Prayer:
    - Personal Prayer: Individual practice, done privately or in personal reflection.
    - Communal Prayer: Conducted in a group setting, such as in churches, mosques, temples, or other places of worship.
    - Public Prayer: Prayers said in public gatherings or events, often led by a religious leader or designated person.
 
  4. Components of Prayer:
    - Invocation: Addressing the deity or higher power.
    - Body of the Prayer: The main content, including adoration, confession, petition, thanksgiving, and intercession.
    - Conclusion: Often includes a phrase of affirmation like "Amen" or other culturally specific closures.
 
  5. Benefits of Prayer:
    - Spiritual Growth: Deepening one’s faith and relationship with the divine.
    - Emotional Well-Being: Providing comfort, hope, and peace in times of stress or difficulty.
    - Community Building: Strengthening bonds within religious or spiritual communities.
    - Moral Guidance: Offering a sense of direction and purpose aligned with religious or spiritual beliefs.
 
  6. Examples of Prayer Practices:
    - Christianity: The Lord's Prayer, daily prayers, rosary, and spontaneous prayers.
    - Islam: Salah (five daily prayers), Du'a (supplications), and Dhikr (remembrance of God).
    - Hinduism: Mantras, bhajans (devotional songs), and puja (ritual worship).
    - Buddhism: Meditation, chanting, and prayer wheels.
    - Judaism: Shema, Amidah, and Kaddish.
 
  Summary:
 
 Prayer is a multifaceted practice that serves as a means of communicating with a higher power, expressing a range of emotions and intentions, and fostering spiritual and community connections. It can take many forms and is a central component of many religious and spiritual traditions.`;
 } else if (userInput.includes('types of prayer') ||(userInput.includes('list the types of prayer we have'))) {
     response = `Prayer can take many forms, reflecting the diverse ways people communicate with the divine or seek spiritual connection. Here are some of the main types of prayer:
 
  1.Adoration (Worship and Praise):
    -Purpose: To honor and praise the divine for its greatness, beauty, and power.
    -Examples: Psalms of praise in the Bible, Islamic prayers glorifying Allah, Hindu bhajans (devotional songs).
 
  2.Confession (Repentance):
    -Purpose: To acknowledge and repent for sins or mistakes, seeking forgiveness and cleansing.
    -Examples: The Christian prayer of confession, Yom Kippur confessions in Judaism, the practice of Tawbah (repentance) in Islam.
 
  3.Thanksgiving:
    -Purpose: To express gratitude for blessings, help received, or positive experiences.
    -Examples: The Christian prayer of thanksgiving, Islamic prayers of thanks (Shukr), Hindu prayers of gratitude after receiving prasad (blessed food).
 
  4.Supplication (Petition and Intercession):
    -Petition: Requests made for oneself.
      -Examples: Personal prayers for help, guidance, healing, or needs.
    -Intercession: Prayers on behalf of others.
      -Examples: Praying for the well-being of others, community prayers for peace, health, or protection.
 
  5.Meditative Prayer:
    -Purpose: To engage in deep reflection or contemplation, seeking a closer connection with the divine presence.
    -Examples: Christian contemplative prayer, Buddhist meditation practices, Sufi practices in Islam.
 
  6.Imprecatory Prayer:
    -Purpose: To invoke God’s judgment or justice, often seen in the context of the psalms in the Bible where divine intervention is sought against enemies.
    -Examples: Certain Psalms in the Bible (like Psalm 109), historical contexts of calling for divine justice.
 
  7.Communal Prayer:
    -Purpose: To unite a group of people in prayer, reinforcing community and shared beliefs.
    -Examples: Congregational prayers in Christian churches, Salat al-Jama'ah (group prayer) in Islam, group chanting or prayer meetings in Hinduism and Buddhism.
 
  8.Ritual Prayer:
    -Purpose: Structured prayers that are part of religious rituals and ceremonies.
    -Examples: The Lord's Prayer in Christianity, the Shema in Judaism, Salah (the five daily prayers) in Islam, Hindu puja ceremonies.
 
  9.Silent Prayer:
    -Purpose: To pray inwardly without spoken words, focusing on personal connection with the divine.
    -Examples: Quaker meetings often include silent prayer, individual silent meditation in various traditions.
 
  10.Vocal Prayer:
    -Purpose: Spoken or sung prayers, either memorized or spontaneous.
    -Examples: Liturgical prayers, prayer hymns, spontaneous spoken prayers.
 
  11.Intercessory Prayer:
    -Purpose: To pray on behalf of others, seeking divine help or intervention for them.
    -Examples: Prayer chains, communal prayers for the sick, intercessory prayers during religious services.
 
  Summary:
 
 Prayer encompasses a wide range of practices and intentions, from worship and gratitude to supplication and intercession. Each type of prayer serves a unique purpose, whether it is to praise the divine, seek forgiveness, express thanks, ask for help, or meditate in silent contemplation. These various forms of prayer reflect the diversity of spiritual experiences and the deep human desire to connect with the divine.`;
 } else if (userInput.includes('who is the president of usa') ||(userInput.includes('what is the name of the president of usa'))) {
     response = `As of now, the President of the United States is Joe Biden.`;
 } else if (userInput.includes('tell me all the name of all the president of every country in this world') ||(userInput.includes('show me all the name of all the president of every country in this world'))) {
     response = `Listing every president of every country in the world would be quite extensive, as there are over 190 countries, and each has its own head of state or government. Additionally, the names of these leaders can change frequently due to elections, appointments, or other political events.
 
 However, I can provide a list of some notable countries and their current presidents. For a comprehensive and up-to-date list, you might want to check a reliable source like the CIA World Factbook or an updated global news website. Here are a few examples:
 
 - United States: Joe Biden
 - France: Emmanuel Macron
 - Germany: Frank-Walter Steinmeier
 - Brazil: Luiz Inácio Lula da Silva
 - South Africa: Cyril Ramaphosa
 - India: Droupadi Murmu
 - Russia: Vladimir Putin
 - China: Xi Jinping (Note: China is a one-party state with a President and a Premier; Xi Jinping is also the General Secretary of the Communist Party of China)
 - Japan: Japan does not have a President; it has a Prime Minister. The current Prime Minister is Fumio Kishida.
 - Mexico: Andrés Manuel López Obrador
 
 If you need information about a specific country or a region, let me know!`;
 } else if (userInput.includes('types of family') ||(userInput.includes('list the types family'))) {
     response = `Families can be categorized into several types based on structure, relationships, and living arrangements. Here are the main types of family structures:
 
  1. Nuclear Family
 - Definition: Consists of two parents (a mother and a father) and their children living together in a single household.
 - Example: A couple with their biological or adopted children.
 
  2. Extended Family
 - Definition: Includes relatives beyond the nuclear family, such as grandparents, aunts, uncles, and cousins, who may live together or in close proximity.
 - Example: A household where grandparents, parents, and children live together or nearby.
 
  3. Single-Parent Family
 - Definition: Consists of one parent raising one or more children on their own, either due to divorce, separation, or choice.
 - Example: A single mother or father raising their children alone.
 
  4. Blended Family
 - Definition: Formed when one or both partners in a couple have children from previous relationships and come together to form a new family unit.
 - Example: A couple with children from previous marriages living together as a new family.
 
  5. Adoptive Family
 - Definition: Includes parents who have legally adopted children, making them part of their family.
 - Example: Parents and their adopted children.
 
  6. Foster Family
 - Definition: Consists of parents who provide temporary care for children who are not their biological or adopted children, usually through a legal or social services arrangement.
 - Example: Foster parents caring for children placed in their home by a child welfare agency.
 
  7. Childless Family
 - Definition: Consists of a couple who do not have children, either by choice or circumstance.
 - Example: A married or cohabiting couple without children.
 
  8. Same-Sex Family
 - Definition: Consists of two people of the same sex who are partners and may have children through adoption, surrogacy, or previous relationships.
 - Example: A same-sex couple raising children together.
 
  9. Co-Habiting Family
 - Definition: Consists of two people living together in a long-term relationship without being legally married.
 - Example: A couple living together as partners but not legally married.
 
  10. Communal or Collective Family
 - Definition: A group of people who live together and share responsibilities, resources, and parenting duties, but may not be related by blood or marriage.
 - Example: A group of friends or extended family members who live together and function as a family unit.
 
  11. Stepfamily
 - Definition: Similar to a blended family, where one partner has children from a previous relationship and the other partner may or may not have children as well.
 - Example: A stepparent with a child or children from a previous marriage living with a new partner and their children.
 
  12. Extended Kinship Network
 - Definition: A broader network of family members who may live in different households but maintain close relationships and support each other.
 - Example: A network including multiple generations and branches of a family who interact regularly and provide mutual support.
 
  Summary
 
 - Nuclear Family: Parents and children.
 - Extended Family: Relatives beyond the nuclear family.
 - Single-Parent Family: One parent and their children.
 - Blended Family: Combined families from previous relationships.
 - Adoptive Family: Parents with adopted children.
 - Foster Family: Temporary care for children.
 - Childless Family: Couple without children.
 - Same-Sex Family: Same-sex partners, potentially with children.
 - Co-Habiting Family: Partners living together without marriage.
 - Communal Family: Group living and sharing responsibilities.
 - Stepfamily: Families formed through new partnerships involving children from previous relationships.
 - Extended Kinship Network: Broader family network maintaining close relationships.😊`;
 } else if (userInput.includes('what is soil')||(userInput.includes('define soil'))) {
     response = `Soil is a natural resource composed of a complex mixture of mineral particles, organic matter, gases, liquids, and living organisms. It is the top layer of the Earth's crust where plants grow and is crucial for supporting life by providing a medium for plant growth, filtering water, and sustaining ecosystems.
 
 Components of Soil
 Mineral Particles:
 
 Sand: Coarse particles that provide good drainage.
 Silt: Fine particles that retain moisture and nutrients.
 Clay: Very fine particles that retain water and nutrients well but may have poor drainage.
 Organic Matter:
 
 Humus: Decomposed organic material from plants and animals that enriches soil by improving its fertility and structure.
 Water:
 
 Soil moisture, which is essential for plant growth, varies with rainfall, irrigation, and drainage.
 Air:
 
 Soil contains air in the spaces between particles, which is important for root respiration and microbial activity.
 Living Organisms:
 
 Microorganisms: Bacteria, fungi, and other microbes that decompose organic matter and contribute to nutrient cycling.
 Macroorganisms: Earthworms, insects, and other larger organisms that aerate the soil and enhance its structure.
 Soil Horizons
 Soil is often organized into layers or horizons:
 
 O Horizon (Organic Layer):
 
 Composed mainly of organic matter such as decomposed leaves and plant material.
 Found at the top of the soil profile.
 A Horizon (Topsoil):
 
 Contains a mix of organic material and minerals.
 It is the most fertile layer, crucial for plant growth.
 E Horizon (Eluviation Layer):
 
 Often lighter in color and less fertile, this layer is where minerals and organic matter are leached out.
 B Horizon (Subsoil):
 
 Accumulates minerals and organic materials leached from above layers.
 Rich in clay and minerals, but lower in organic matter.
 C Horizon (Parent Material):
 
 Consists of weathered rock and minerals from which the soil develops.
 It is less affected by biological activity.
 R Horizon (Bedrock):
 
 The layer of unweathered rock beneath the soil profile.😊`;
 } else if (userInput.includes('list the types of soil we have')||(userInput.includes('types of soil'))||(userInput.includes('type of soil'))||(userInput.includes('l;ist any types of soil'))) {
     response = `Soil types are often classified based on their texture, composition, and drainage characteristics. The primary types of soil include:
 
 1. Loamy Soil
 - Description: A balanced mixture of sand, silt, and clay.
 - Characteristics:
   - Good drainage.
   - Excellent fertility.
   - Retains moisture and nutrients well.
 - Ideal For: Most plants, including vegetables and flowers.
 
 2. Sandy Soil
 - Description: Coarse texture with large, gritty particles.
 - Characteristics:
   - Drains quickly.
   - Low water and nutrient retention.
   - Warms up quickly in the spring.
 - Ideal For: Plants that require good drainage, such as cacti and succulents.
 
 3. Clay Soil
 - Description: Fine texture with small, densely packed particles.
 - Characteristics:
   - Retains water and nutrients well.
   - Poor drainage, can become compacted.
   - Tends to be heavy and sticky when wet.
 - Ideal For: Plants that require steady moisture, such as rice and certain types of vegetables.
 
 4. Silt Soil
 - Description: Fine particles that are smooth and floury to the touch.
 - Characteristics:
   - Retains moisture and nutrients effectively.
   - Smooth texture, can become compacted.
   - Better drainage than clay but less than sand.
 - Ideal For: Plants that need moisture and nutrients, such as lettuce and cabbage.
 
 5. Peaty Soil
 - Description: Soil rich in organic matter and moisture.
 - Characteristics:
   - Dark brown to black color.
   - High moisture retention.
   - Acidic pH.
 - Ideal For: Plants that thrive in acidic and moist conditions, such as blueberries and certain ferns.
 
 6. Saline Soil
 - Description: Soil with high salt content.
 - Characteristics:
   - High electrical conductivity.
   - Can hinder plant growth due to salinity.
   - Often found in arid regions or near saltwater bodies.
 - Ideal For: Salt-tolerant plants, such as some types of grasses and shrubs.
 
 7. Chalky Soil
 - Description: Soil that is alkaline due to the presence of calcium carbonate.
 - Characteristics:
   - Typically stony and well-drained.
   - Can be poor in nutrients and may require additional organic matter.
   - High pH level.
 - Ideal For: Plants that prefer alkaline conditions, such as lilacs and certain herbs.
 
 8. Alluvial Soil
 - Description: Soil deposited by rivers and streams.
 - Characteristics:
   - Often fertile and well-drained.
   - Contains a mix of sand, silt, and clay.
   - Usually found in floodplains.
 - Ideal For: Crops that benefit from nutrient-rich soil, such as grains and vegetables.
 
 9. Regur Soil
 - Description: Also known as black soil, rich in iron, calcium, magnesium, and alumina.
 - Characteristics:
   - Fertile and retains moisture well.
   - Ideal for cotton cultivation.
 - Ideal For: Cotton, as well as a range of other crops.
 
 10. Desert Soil
 - Description: Soil found in arid and semi-arid regions.
 - Characteristics:
   - Sandy or rocky texture.
   - Low in organic matter and nutrients.
   - Poor water retention.
 - Ideal For: Drought-tolerant plants like desert shrubs and some grasses.
 
 Understanding these soil types helps in selecting appropriate plants, managing soil fertility, and improving agricultural practices.😊`;
 } else if (userInput.includes('what is physical quantity') ||(userInput.includes('define physical quantity'))) {
     response = `A physical quantity is a property of a physical phenomenon that can be measured and quantified. It is characterized by both a numerical value and a unit of measurement. Physical quantities are used to describe and quantify physical properties and behaviors of objects and systems.
 
 Examples of Physical Quantities
 
 1. Length: Measured in units such as meters (m), centimeters (cm), or inches.
    - Example: The length of a table is 2 meters.
 
 2. Mass: Measured in units such as kilograms (kg), grams (g), or pounds (lb).
    - Example: The mass of a book is 300 grams.
 
 3. Time: Measured in units such as seconds (s), minutes (min), or hours (h).
    - Example: The duration of a movie is 2 hours.
 
 4. Temperature: Measured in units such as degrees Celsius (°C), Kelvin (K), or degrees Fahrenheit (°F).
    - Example: The temperature today is 25°C.
 
 5. Speed: Measured in units such as meters per second (m/s), kilometers per hour (km/h), or miles per hour (mph).
    - Example: The speed of a car is 60 km/h.
 
 6. Force: Measured in units such as newtons (N) or pounds-force (lbf).
    - Example: The force applied to push a door is 10 newtons.
 
 7. Electric Current: Measured in units such as amperes (A).
    - Example: The current flowing through a circuit is 5 amperes.
 
 8. Volume: Measured in units such as liters (L), milliliters (mL), or cubic meters (m³).
    - Example: The volume of a liquid in a bottle is 1 liter.
 
 Components of a Physical Quantity
 
 1. Magnitude: The numerical value of the quantity.
 2. Unit: The standard measure used to express the magnitude.
 
 Physical quantities are fundamental to the study of physics and other sciences, as they allow scientists and engineers to describe and analyze the physical world in a systematic and consistent manner.😊`;
 } else if (userInput.includes('define atom')) {
     response = 'An atom is the smallest unit of matter that retains the properties of an element.😊';
 } else if (userInput.includes('what is civic') ||(userInput.includes('what is civic education')) ||(userInput.includes('define is civic education'))||(userInput.includes('define civic'))) {
     response =`Civic refers to anything related to the duties, rights, and responsibilities of citizens within a community, city, or country. It encompasses the principles and practices that contribute to the functioning of a society and the active participation of individuals in their community and governmental processes.
 
  Key Aspects of Civic Understanding
 
 1. Civic Duties:
    - Voting: Participating in elections to choose leaders and shape public policy.
    - Obeying Laws: Following rules and regulations established by the government.
    - Paying Taxes: Contributing financially to the public services and infrastructure.
    - Jury Duty: Serving as a juror in legal proceedings when called upon.
 
 2. Civic Rights:
    - Freedom of Speech: The right to express opinions and ideas without government interference.
    - Right to Privacy: Protection from unwarranted government intrusion into personal life.
    `;
 } else if (userInput.includes('i am fine') ||(userInput.includes('I am fine and you too')) ||(userInput.includes('i am not fine'))||(userInput.includes('i am not fine and you too'))) {
     response =`Okay go on with your questions`;
 } else if (userInput.includes('okay')) {
     response =`if you have more questions you can ask`;
 } else if (userInput.includes('how did you know i have question') ||(userInput.includes('did you no weather i have question'))) {
     response =`I dont know but you can chat`;
 } else if (userInput.includes('state the rule of law')||(userInput.includes('explain the rule of law'))) {
     response =`The Rule of Law is a fundamental principle in democratic governance and legal systems, which asserts that all individuals, institutions, and government entities are subject to and accountable under the law. This principle ensures that laws are applied equally and fairly, and that no one is above the law. Here are the key aspects of the Rule of Law:
 
  Key Principles of the Rule of Law
 
 1. Supremacy of the Law:
    - Definition: The law is the highest authority and applies equally to all individuals and institutions, including government officials.
    - Implication: Everyone, regardless of their status or position, must comply with the law.
 
 2. Equality Before the Law:
    - Definition: All individuals are treated equally under the law without discrimination.
    - Implication: Legal protections and responsibilities are the same for everyone, and discrimination based on race, gender, religion, or status is prohibited.
 
 3. Accountability:
    - Definition: Government officials and institutions are accountable for their actions and decisions under the law.
    - Implication: Public officials must act within the boundaries of the law and are subject to legal scrutiny and consequences.
 
 4. Legal Certainty:
    - Definition: Laws must be clear, stable, and publicly accessible so that individuals can understand and comply with them.
    - Implication: Laws should be predictable and not applied retroactively.
 
 5. Fair and Impartial Judiciary:
    - Definition: The judiciary must be independent, impartial, and free from undue influence or bias.
    - Implication: Legal disputes should be resolved based on evidence and legal principles, not on personal or political considerations.
 
 6. Protection of Fundamental Rights:
    - Definition: The rule of law ensures the protection and respect of fundamental human rights and freedoms.
    - Implication: Individuals have the right to a fair trial, due process, and protection from arbitrary actions.
 
 7. Due Process:
    - Definition: Legal procedures must be followed to ensure fair treatment and justice.
    - Implication: Individuals have the right to a fair hearing and an opportunity to present their case.
 
 8. Transparency:
    - Definition: Legal processes and decisions must be open and transparent to the public.
    - Implication: The administration of justice should be visible and accessible to ensure accountability and trust.
 
  Importance of the Rule of Law
 
 - Promotes Justice: Ensures that laws are applied fairly and consistently, protecting individuals' rights and liberties.
 - Prevents Abuse of Power: Limits the potential for arbitrary or unjust actions by those in authority.
 - Enhances Stability: Provides a predictable and orderly framework for resolving disputes and managing societal interactions.
 - Fosters Trust: Builds public confidence in the legal and governmental systems by ensuring transparency and accountability.
 
 In summary, the Rule of Law is essential for maintaining a just and functional society, ensuring that legal principles govern the actions of all individuals and institutions, and safeguarding the rights and freedoms of citizens.`;
 } else if (userInput.includes('what is feudalism')) {
     response =`Feudalism was a social, economic, and political system that dominated medieval Europe, particularly from the 9th to the 15th centuries. It is characterized by a hierarchical system of land ownership and obligations that structured society and governance. `;
 } else if (userInput.includes('what is the 45 speech sound we have in english language')) {
     response =`The English language is traditionally described as having 44 phonemes (speech sounds), though some analyses count slightly more or fewer depending on dialectal variations and linguistic interpretations. These phonemes can be divided into vowels and consonants. Below is a general overview of these sounds:
 
  Vowels
 
 There are typically 20 vowel sounds in English, divided into monophthongs (single vowel sounds) and diphthongs (gliding vowel sounds).
 
 Monophthongs (12 sounds):
 1. /iː/ as in "fleece"
 2. /ɪ/ as in "kit"
 3. /e/ as in "dress"
 4. /æ/ as in "trap"
 5. /ɑː/ as in "palm"
 6. /ɒ/ as in "lot" (not in all dialects, e.g., American English typically uses /ɑː/ for this sound)
 7. /ɔː/ as in "thought"
 8. /ʊ/ as in "foot"
 9. /uː/ as in "goose"
 10. /ʌ/ as in "strut"
 11. /ɜː/ as in "nurse"
 12. /ə/ as in "comma" (schwa)
 
 Diphthongs (8 sounds):
 1. /eɪ/ as in "face"
 2. /aɪ/ as in "price"
 3. /ɔɪ/ as in "choice"
 4. /aʊ/ as in "mouth"
 5. /əʊ/ as in "goat"
 6. /ɪə/ as in "near"
 7. /eə/ as in "square"
 8. /ʊə/ as in "cure"
 
  Consonants
 
 There are typically 24 consonant sounds in English:
 
 1. /p/ as in "pat"
 2. /b/ as in "bat"
 3. /t/ as in "tap"
 4. /d/ as in "dam"
 5. /k/ as in "cat"
 6. /ɡ/ as in "gap"
 7. /tʃ/ as in "chin"
 8. /dʒ/ as in "jam"
 9. /f/ as in "fat"
 10. /v/ as in "vat"
 11. /θ/ as in "thin"
 12. /ð/ as in "this"
 13. /s/ as in "sip"
 14. /z/ as in "zip"
 15. /ʃ/ as in "ship"
 16. /ʒ/ as in "measure"
 17. /h/ as in "hat"
 18. /m/ as in "man"
 19. /n/ as in "nap"
 20. /ŋ/ as in "sing"
 21. /l/ as in "lap"
 22. /r/ as in "rat"
 23. /j/ as in "yes"
 24. /w/ as in "wet"
 
  Additional Considerations
 
 Some dialects of English may have additional phonemes or different realizations of these sounds. For example, the rhotic accent of American English includes the retroflex approximant /ɻ/, while non-rhotic accents like British Received Pronunciation may not have certain rhotic sounds.
 
 Phonemes are the smallest units of sound that can distinguish meaning in a language. These 44 sounds form the foundation of English pronunciation and are combined to produce the words and sentences we use in everyday communication. `;



} else if (userInput.includes('what is government')) {
    response = `A government is the system or group of people responsible for making and enforcing laws, managing public policies, and overseeing the administration of a state or community. It provides the framework for political authority and decision-making, ensuring that societal functions are carried out and public needs are met. Governments operate at various levels, including local, regional, and national, and can take different forms, such as:

1. Democracy: A system where power is vested in the people, who exercise it directly or through elected representatives. Examples include representative democracies (e.g., the United States) and direct democracies (e.g., Switzerland).

2. Monarchy: A system where a single individual, the monarch, holds sovereign authority. Monarchies can be:
   - Absolute Monarchy: The monarch has almost complete control over the government (e.g., Saudi Arabia).
   - Constitutional Monarchy: The monarch's powers are limited by a constitution, and there is often a parliamentary system in place (e.g., the United Kingdom).

3. Authoritarianism: A system where power is concentrated in a single ruler or a small group, often with limited political freedoms and centralized control (e.g., North Korea).

4. Totalitarianism: An extreme form of authoritarianism where the government seeks to control nearly every aspect of public and private life (e.g., historical examples include Nazi Germany and Stalinist Soviet Union).

5. Communism: A political and economic ideology advocating for a classless society where all property is communally owned and each person contributes and receives according to their ability and needs (e.g., Cuba, historical example: the Soviet Union).

6. Socialism: A system where the means of production and distribution are regulated by the community or the state, aiming for equitable distribution of wealth and resources. Socialism can coexist with democratic structures (e.g., Scandinavian countries).

7. Republic: A system where the head of state is elected, and the government operates under a system of laws and represents the people, often through elected officials (e.g., the United States, France).

8. Theocracy: A system where religious leaders or institutions hold political power, and the state's legal system is based on religious laws (e.g., Iran).

Governments are responsible for creating laws, ensuring public safety, providing services, and managing economic and social policies.`;

 } else if (userInput.includes('state the monophthongs')) {
     response =`Monophthongs (12 sounds):
 1. /iː/ as in "fleece"
 2. /ɪ/ as in "kit"
 3. /e/ as in "dress"
 4. /æ/ as in "trap"
 5. /ɑː/ as in "palm"
 6. /ɒ/ as in "lot" (not in all dialects, e.g., American English typically uses /ɑː/ for this sound)
 7. /ɔː/ as in "thought"
 8. /ʊ/ as in "foot"
 9. /uː/ as in "goose"
 10. /ʌ/ as in "strut"
 11. /ɜː/ as in "nurse"
 12. /ə/ as in "comma" (schwa) `;
} else if (userInput.includes('aloof')) {
    response = "Aloof: Not friendly or forthcoming; cool and distant.";
} else if (userInput.includes('brusque')) {
    response = "Brusque: Abrupt or offhand in speech or manner.";
} else if (userInput.includes('callous')) {
    response = "Callous: Showing or having an insensitive and cruel disregard for others.";
} else if (userInput.includes('daunt')) {
    response = "Daunt: To make someone feel intimidated or apprehensive.";
} else if (userInput.includes('earnest')) {
    response = "Earnest: Showing sincere and intense conviction.";
} else if (userInput.includes('flabbergasted')) {
    response = "Flabbergasted: Extremely surprised or shocked.";
} else if (userInput.includes('glib')) {
    response = "Glib: Fluent but insincere and shallow.";
} else if (userInput.includes('haughty')) {
    response = "Haughty: Arrogantly superior and disdainful.";
} else if (userInput.includes('inept')) {
    response = "Inept: Having or showing no skill; clumsy.";
} else if (userInput.includes('jovial')) {
    response = "Jovial: Cheerful and friendly.";
} else if (userInput.includes('kinetic')) {
    response = "Kinetic: Relating to or resulting from motion.";
} else if (userInput.includes('lethargic')) {
    response = "Lethargic: Affected by lethargy; sluggish and apathetic.";
} else if (userInput.includes('meander')) {
    response = "Meander: To follow a winding course.";
} else if (userInput.includes('nonchalant')) {
    response = "Nonchalant: Feeling or appearing casually calm and relaxed.";
} else if (userInput.includes('oblivious')) {
    response = "Oblivious: Not aware of or concerned about what is happening around.";
} else if (userInput.includes('paradox')) {
    response = "Paradox: A seemingly absurd or self-contradictory statement or proposition.";
} else if (userInput.includes('quixotic')) {
    response = "Quixotic: Extremely idealistic, unrealistic, and impractical.";
} else if (userInput.includes('ravenous')) {
    response = "Ravenous: Extremely hungry.";
} else if (userInput.includes('serendipity')) {
    response = "Serendipity: The occurrence of events by chance in a happy or beneficial way.";
} else if (userInput.includes('taciturn')) {
    response = "Taciturn: Reserved or uncommunicative in speech; saying little.";
} else if (userInput.includes('ubiquitous')) {
    response = "Ubiquitous: Present, appearing, or found everywhere.";
} else if (userInput.includes('vicarious')) {
    response = "Vicarious: Experienced in the imagination through the feelings or actions of another person.";
} else if (userInput.includes('whimsical')) {
    response = "Whimsical: Playfully quaint or fanciful, especially in an appealing and amusing way.";
} else if (userInput.includes('yearning')) {
    response = "Yearning: A feeling of intense longing for something.";
} else if (userInput.includes('zenith')) {
    response = "Zenith: The highest point reached by a celestial or other object.";
} else if (userInput.includes('audacious')) {
    response = "Audacious: Showing a willingness to take surprisingly bold risks.";
} else if (userInput.includes('banal')) {
    response = "Banal: So lacking in originality as to be obvious and boring.";
} else if (userInput.includes('candor')) {
    response = "Candor: The quality of being open and honest in expression; frankness.";
} else if (userInput.includes('debilitate')) {
    response = "Debilitate: To make someone weak and infirm.";
} else if (userInput.includes('eclectic')) {
    response = "Eclectic: Deriving ideas, style, or taste from a broad and diverse range of sources.";
} else if (userInput.includes('fickle')) {
    response = "Fickle: Changing frequently, especially as regards one's loyalties or affections.";
} else if (userInput.includes('grandiose')) {
    response = "Grandiose: Impressive or magnificent in appearance or style, especially pretentiously so.";
} else if (userInput.includes('harbinger')) {
    response = "Harbinger: A person or thing that announces or signals the approach of another.";
} else if (userInput.includes('idyllic')) {
    response = "Idyllic: Extremely happy, peaceful, or picturesque.";
} else if (userInput.includes('juxtapose')) {
    response = "Juxtapose: Place or deal with close together for contrasting effect.";
} else if (userInput.includes('languid')) {
    response = "Languid: Displaying or having a disinclination for physical exertion or effort; slow and relaxed.";
} else if (userInput.includes('meticulous')) {
    response = "Meticulous: Showing great attention to detail; very careful and precise.";
} else if (userInput.includes('nadir')) {
    response = "Nadir: The lowest point in the fortunes of a person or organization.";
} else if (userInput.includes('ostracize')) {
    response = "Ostracize: Exclude from a society or group.";
} else if (userInput.includes('pernicious')) {
    response = "Pernicious: Having a harmful effect, especially in a gradual or subtle way.";
} else if (userInput.includes('quagmire')) {
    response = "Quagmire: A soft boggy area of land that gives way underfoot; a complex or hazardous situation.";
} else if (userInput.includes('rancor')) {
    response = "Rancor: Bitterness or resentfulness, especially when long-standing.";
} else if (userInput.includes('stoicism')) {
    response = "Stoicism: The endurance of pain or hardship without the display of feelings and without complaint.";
} else if (userInput.includes('trepidation')) {
    response = "Trepidation: A feeling of fear or agitation about something that may happen.";
} else if (userInput.includes('unfathomable')) {
    response = "Unfathomable: Incapable of being fully explored or understood.";
} else if (userInput.includes('vitriolic')) {
    response = "Vitriolic: Filled with bitter criticism or malice.";
} else if (userInput.includes('wistfully')) {
    response = "Wistfully: Longingly; in a wishful manner.";
} else if (userInput.includes('zealot')) {
    response = "Zealot: A person who is fanatical and uncompromising in pursuit of their religious, political, or other ideals.";
} else if (userInput.includes('adamant')) {
    response = "Adamant: Refusing to be persuaded or to change one's mind.";
} else if (userInput.includes('blandish')) {
    response = "Blandish: To coax someone with kind words or flattery.";
} else if (userInput.includes('capricious')) {
    response = "Capricious: Given to sudden and unaccountable changes of mood or behavior.";
} else if (userInput.includes('deleterious')) {
    response = "Deleterious: Causing harm or damage.";
} else if (userInput.includes('how many planet do we have')) {
    response = "We have millions of planet but eight are knowed.";
} else if (userInput.includes('esoteric')) {
    response = "Esoteric: Intended for or likely to be understood by only a small number of people with a specialized knowledge.";
} else if (userInput.includes('furtive')) {
    response = "Furtive: Attempting to avoid notice or attention, typically because of guilt or a belief that discovery would lead to trouble.";
} else if (userInput.includes('gregarious')) {
    response = "Gregarious: Fond of company; sociable.";
} else if (userInput.includes('hypocrisy')) {
    response = "Hypocrisy: The practice of claiming to have moral standards or beliefs to which one's own behavior does not conform.";
} else if (userInput.includes('iconoclast')) {
    response = "Iconoclast: A person who attacks or criticizes cherished beliefs or institutions.";
} else if (userInput.includes('abate')) {
    response = "Abate: To lessen or reduce in intensity.";
} else if (userInput.includes('benevolent')) {
    response = "Benevolent: Well-meaning and kindly.";
} else if (userInput.includes('candid')) {
    response = "Candid: Truthful and straightforward.";
} else if (userInput.includes('what is drug abuse')) {
    response = `Drug abuse, also known as substance abuse, refers to the excessive or inappropriate use of drugs that leads to harmful consequences for the individual or society. It involves the misuse of both legal and illegal substances, including prescription medications, over-the-counter drugs, and recreational drugs, often resulting in addiction, health problems, and impaired functioning.

Key aspects of drug abuse include:

1. Substance Misuse: Using drugs in a manner that is not intended, such as taking higher doses than prescribed or using substances not meant for recreational use. This includes both legal substances (e.g., alcohol, prescription medications) and illegal drugs (e.g., cocaine, heroin).

2. Dependence and Addiction: Developing a psychological or physical dependence on a drug, where individuals feel compelled to use it despite negative consequences. Addiction can lead to a loss of control over drug use and compulsive behavior.

3. Health Risks: Drug abuse can lead to a range of health problems, including physical ailments (e.g., liver damage, heart disease), mental health issues (e.g., depression, anxiety), and increased risk of infectious diseases (e.g., HIV, hepatitis) due to unsafe practices.

4. Impaired Functioning: Substance abuse can affect an individual's ability to perform daily activities, maintain relationships, and fulfill responsibilities. It can lead to problems in work, school, and social interactions.

5. Social and Legal Consequences: Drug abuse often results in legal issues, including arrests and criminal charges. It can also strain relationships with family and friends, leading to social isolation and conflict.

6. Withdrawal and Tolerance: Over time, individuals may develop a tolerance to a drug, requiring increasingly larger amounts to achieve the same effects. Withdrawal symptoms can occur when the drug is not available, leading to physical and emotional distress.

7. Treatment and Recovery: Addressing drug abuse often involves a combination of medical treatment, counseling, and support. Treatment may include detoxification, therapy (individual or group), and support groups to help individuals recover and manage their addiction.

Prevention and intervention efforts focus on educating individuals about the risks of drug abuse, providing support and resources for those struggling with addiction, and promoting healthy coping mechanisms and lifestyles.`;
} else if (userInput.includes('consequences of drug abuse')) {
    response = `Drug abuse can have profound and far-reaching consequences, affecting various aspects of an individual's life and society as a whole. Here are some of the major consequences:

 Health Consequences

1. Physical Health Problems:
   - Chronic Diseases: Long-term drug abuse can lead to serious health issues, such as liver damage (cirrhosis), cardiovascular problems (heart disease, stroke), and respiratory issues (lung damage, chronic obstructive pulmonary disease).
   - Infections: Use of intravenous drugs can lead to infections like HIV, hepatitis B and C, and other bloodborne diseases.
   - Neurological Damage: Drugs can impair brain function, leading to cognitive deficits, memory problems, and mental health disorders.

2. Mental Health Issues:
   - Addiction and Dependence: Prolonged drug use can lead to psychological dependence and addiction, making it difficult for individuals to stop using the drug despite negative consequences.
   - Mood Disorders: Drug abuse can contribute to mental health disorders such as depression, anxiety, paranoia, and psychosis.
   - Cognitive Impairment: Chronic use can impair cognitive functions, affecting decision-making, concentration, and problem-solving skills.

 Social Consequences

1. Relationship Strain:
   - Family Issues: Drug abuse can create conflicts, distrust, and emotional pain within families, often leading to estrangement or breakdowns in relationships.
   - Social Isolation: Individuals may become socially isolated as they withdraw from family, friends, and social activities.

2. Work and Educational Impact:
   - Employment Problems: Drug abuse can lead to absenteeism, decreased job performance, and job loss, affecting career prospects and financial stability.
   - Educational Challenges: Students may experience difficulties in academic performance, leading to poor grades and increased dropout rates.

 Legal and Financial Consequences

1. Legal Issues:
   - Criminal Charges: Engaging in illegal drug use or trafficking can lead to legal consequences, including arrests, criminal charges, and incarceration.
   - Legal Costs: Facing legal problems can result in significant financial burdens due to legal fees and fines.

2. Financial Problems:
   - Increased Expenses: The cost of obtaining drugs can lead to financial difficulties, often resulting in debt and financial instability.
   - Loss of Income: Drug abuse can lead to job loss or reduced earning potential, exacerbating financial problems.

 Impact on Society

1. Public Health Costs:
   - Healthcare Burden: Drug abuse can place a significant strain on healthcare systems due to the need for medical treatment, emergency care, and rehabilitation services.
   - Increased Risk of Disease: The spread of infectious diseases and other health issues related to drug abuse can affect public health and increase healthcare costs.

2. Crime and Safety:
   - Increased Crime Rates: Drug abuse is often linked to increased criminal activity, including drug trafficking, property crime, and violence.
   - Safety Concerns: Impaired judgment and behavior due to drug abuse can lead to accidents and unsafe situations, both for the individual and others.

Addressing the consequences of drug abuse requires a comprehensive approach that includes prevention, early intervention, treatment, and support for recovery. It involves collaboration between healthcare providers, legal systems, social services, and community organizations.`;
} else if (userInput.includes('deft')) {
    response = "Deft: Skillful and quick in movement.";
} else if (userInput.includes('elusive')) {
    response = "Elusive: Difficult to find, catch, or achieve.";
} else if (userInput.includes('fervor')) {
    response = "Fervor: Intense and passionate feeling.";
} else if (userInput.includes('gregarious')) {
    response = "Gregarious: Fond of company; sociable.";
} else if (userInput.includes('hinder')) {
    response = "Hinder: Create difficulties that result in delay or obstruction.";
} else if (userInput.includes('inquisitive')) {
    response = "Inquisitive: Curious or inquiring.";
} else if (userInput.includes('jubilant')) {
    response = "Jubilant: Feeling or expressing great happiness.";
} else if (userInput.includes('keen')) {
    response = "Keen: Having or showing eagerness or enthusiasm.";
} else if (userInput.includes('what is drug')) {
    response = `A drug is any substance that, when introduced into the body, alters its normal functioning. Drugs can have various effects on physical or mental health, and they are categorized based on their intended use, effects, and legal status. Here are some key categories and definitions:

 Categories of Drugs

1. Prescription Drugs:
   - Definition: Medications that are prescribed by a healthcare provider to treat specific medical conditions. They are regulated and dispensed through pharmacies.
   - Examples: Antibiotics, antidepressants, pain relievers, and antihypertensives.

2. Over-the-Counter (OTC) Drugs:
   - Definition: Medications available without a prescription, typically used for common ailments or symptoms.
   - Examples: Pain relievers (e.g., ibuprofen, acetaminophen), cough syrup, and antacids.

3. Recreational Drugs:
   - Definition: Substances used primarily for their psychoactive effects, often for pleasure or relaxation. They can be legal or illegal.
   - Examples: Alcohol, cannabis, and cocaine.

4. Illegal Drugs:
   - Definition: Substances that are prohibited by law due to their potential for abuse and harm. They are often associated with addiction and legal consequences.
   - Examples: Heroin, methamphetamine, and MDMA (ecstasy).

5. Controlled Substances:
   - Definition: Drugs that are regulated by government authorities due to their potential for abuse and dependence. They are classified into different schedules based on their medical use and abuse potential.
   - Examples: Opioids (e.g., oxycodone, morphine), benzodiazepines, and stimulants (e.g., amphetamines).

6. Pharmaceutical Drugs:
   - Definition: Drugs developed for medical use to diagnose, treat, or prevent diseases and conditions. They undergo rigorous testing and regulation.
   - Examples: Chemotherapy drugs, vaccines, and insulin.

 Effects of Drugs

- Physical Effects: Drugs can affect various bodily systems, leading to changes in metabolism, heart rate, blood pressure, and other physiological functions.
- Mental Effects: Drugs can influence mood, cognition, perception, and behavior. They may cause changes in consciousness, emotions, and mental processes.
- Therapeutic Effects: When used appropriately, drugs can provide relief from symptoms, cure diseases, and improve quality of life.
- Side Effects: Unintended effects that may occur alongside the desired therapeutic effects. These can range from mild to severe and may include allergic reactions, nausea, or dizziness.

 Legal and Ethical Considerations

- Legal Status: The legality of a drug varies by country and jurisdiction. Some drugs are legal for medical or recreational use, while others are strictly controlled or banned.
- Ethical Use: The use of drugs should be guided by ethical considerations, including adherence to medical guidelines, prevention of misuse, and respect for laws and regulations.

Understanding the types and effects of drugs is essential for making informed decisions about their use, whether for medical treatment or recreational purposes.`;
} else if (userInput.includes('types of drug')) {
    response = `Drugs can be classified into several types based on their use, effects, and legal status. Here are the major types of drugs:

 1. Prescription Drugs
- Definition: Medications prescribed by healthcare providers for specific health conditions.
- Examples:
  - Antibiotics: Treat bacterial infections (e.g., amoxicillin, ciprofloxacin).
  - Antidepressants: Manage depression and anxiety (e.g., sertraline, fluoxetine).
  - Pain Relievers: Alleviate pain (e.g., oxycodone, morphine).
  - Antihypertensives: Control high blood pressure (e.g., lisinopril, amlodipine).

 2. Over-the-Counter (OTC) Drugs
- Definition: Medications available without a prescription for common ailments.
- Examples:
  - Pain Relievers: Treat minor pain and fever (e.g., ibuprofen, acetaminophen).
  - Cough and Cold Remedies: Alleviate symptoms of colds and coughs (e.g., dextromethorphan, pseudoephedrine).
  - Antacids: Reduce stomach acidity (e.g., Tums, ranitidine).

 3. Recreational Drugs
- Definition: Substances used for their psychoactive effects, often for pleasure or relaxation.
- Examples:
  - Alcohol: A depressant that affects mood and behavior.
  - Cannabis (Marijuana): Known for its psychoactive effects and potential therapeutic uses.
  - Caffeine: A stimulant found in coffee, tea, and energy drinks.

 4. Illegal Drugs
- Definition: Substances prohibited by law due to their potential for abuse and harm.
- Examples:
  - Heroin: An opioid with high addiction potential.
  - Cocaine: A stimulant that affects the central nervous system.
  - Methamphetamine: A powerful stimulant with severe health risks.

 5. Controlled Substances
- Definition: Drugs regulated by government authorities due to their potential for abuse and dependence.
- Examples:
  - Opioids: Used for pain management but with high addiction risk (e.g., fentanyl, codeine).
  - Benzodiazepines: Used for anxiety and sleep disorders (e.g., diazepam, lorazepam).
  - Stimulants: Used for attention deficit disorders (e.g., amphetamines, methylphenidate).

 6. Pharmaceutical Drugs
- Definition: Medications developed for medical purposes, including treatment, diagnosis, and prevention of diseases.
- Examples:
  - Chemotherapy Drugs: Treat cancer (e.g., cisplatin, doxorubicin).
  - Vaccines: Prevent infectious diseases (e.g., influenza vaccine, COVID-19 vaccine).
  - Insulin: Regulates blood sugar levels in diabetes.

 7. Herbal and Natural Remedies
- Definition: Plant-based or natural substances used for medicinal purposes.
- Examples:
  - Echinacea: Often used to boost the immune system.
  - Ginger: Used for digestive issues and nausea.
  - St. John's Wort: Used for mild to moderate depression.

 8. Anabolic Steroids
- Definition: Synthetic derivatives of testosterone used to promote muscle growth and enhance athletic performance.
- Examples:
  - Testosterone: Used in hormone therapy and performance enhancement.
  - Nandrolone: Used to increase muscle mass and strength.

Each type of drug has specific uses, benefits, and risks. Understanding these categories helps in making informed decisions about drug use, whether for health or recreational purposes.`;
} else if (userInput.includes('lucid')) {
    response = "Lucid: Expressed clearly; easy to understand.";
} else if (userInput.includes('mirth')) {
    response = "Mirth: Amusement, especially expressed in laughter.";
} else if (userInput.includes('nebulous')) {
    response = "Nebulous: Unclear, vague, or ill-defined.";
} else if (userInput.includes('obstinate')) {
    response = "Obstinate: Stubbornly refusing to change one's opinion.";
} else if (userInput.includes('placid')) {
    response = "Placid: Not easily upset or excited; calm.";
} else if (userInput.includes('quell')) {
    response = "Quell: To put an end to, typically by the use of force.";
} else if (userInput.includes('resilient')) {
    response = "Resilient: Able to recover quickly from difficult conditions.";
} else if (userInput.includes('stoic')) {
    response = "Stoic: Enduring pain or hardship without showing feelings.";
} else if (userInput.includes('tenacious')) {
    response = "Tenacious: Holding firmly to something; persistent.";
} else if (userInput.includes('undaunted')) {
    response = "Undaunted: Not intimidated by difficulty, danger, or disappointment.";
} else if (userInput.includes('vigilant')) {
    response = "Vigilant: Keeping careful watch for possible danger or difficulties.";
} else if (userInput.includes('wistful')) {
    response = "Wistful: Having or showing a feeling of vague or regretful longing.";
} else if (userInput.includes('xenial')) {
    response = "Xenial: Relating to hospitality or relations between host and guest.";
} else if (userInput.includes('yearn')) {
    response = "Yearn: To have an intense feeling of longing for something.";
} else if (userInput.includes('zealous')) {
    response = "Zealous: Filled with or showing a strong and energetic desire to get something done.";
 } else if (userInput.includes('state the consonants')) {
     response =`Consonants
 
 There are typically 24 consonant sounds in English:
 
 1. /p/ as in "pat"
 2. /b/ as in "bat"
 3. /t/ as in "tap"
 4. /d/ as in "dam"
 5. /k/ as in "cat"
 6. /ɡ/ as in "gap"
 7. /tʃ/ as in "chin"
 8. /dʒ/ as in "jam"
 9. /f/ as in "fat"
 10. /v/ as in "vat"
 11. /θ/ as in "thin"
 12. /ð/ as in "this"
 13. /s/ as in "sip"
 14. /z/ as in "zip"
 15. /ʃ/ as in "ship"
 16. /ʒ/ as in "measure"
 17. /h/ as in "hat"
 18. /m/ as in "man"
 19. /n/ as in "nap"
 20. /ŋ/ as in "sing"
 21. /l/ as in "lap"
 22. /r/ as in "rat"
 23. /j/ as in "yes"
 24. /w/ as in "wet" `;



} else if (userInput.includes('what is tolerance')||(userInput.includes('tolerance'))) {
    response = `Tolerance is the ability or willingness to accept and respect differences in opinions, beliefs, behaviors, and characteristics of others, even if they are different from one's own. It involves recognizing diversity and allowing others to have their own perspectives without prejudice or discrimination. Tolerance is often associated with promoting harmony and peaceful coexistence in societies with varying viewpoints or practices.`;

} else if (userInput.includes('what is personal belonging')||(userInput.includes('define personal belonging'))) {
    response = `Personal belongings refer to items or possessions that belong to an individual. These can include anything that is owned or used by a person for their personal use, such as clothing, gadgets, books, accessories, or sentimental items. Personal belongings are typically things that one carries, keeps, or uses in their daily life and are considered private property.`;

} else if (userInput.includes('types of personal belonging')||(userInput.includes('examples of personal belonging'))) {
    response = `Personal belongings can be categorized into various types based on their nature and purpose. Here are some common types:

1. Clothing and Accessories: Items like shirts, pants, shoes, bags, jewelry, and watches that people wear or use to complement their appearance.

2. Electronic Devices: Gadgets such as smartphones, laptops, tablets, cameras, and headphones that are used for communication, work, and entertainment.

3. Documents and Identification: Important papers like passports, driver's licenses, identification cards, certificates, and legal documents that provide personal identity or ownership.

4. Sentimental Items: Personal possessions with emotional value, such as photographs, letters, keepsakes, or gifts from loved ones.

5. Household Items: Personal items like toiletries, bedding, personal care products, and small kitchen utensils.

6. Books and Media: Books, magazines, personal journals, music collections, and movies that an individual owns for leisure or educational purposes.

7. Financial Items: Credit cards, debit cards, cash, checkbooks, and financial documents that relate to an individual’s money or assets.

8. Health and Fitness Items: Personal items like prescription glasses, medications, fitness equipment, and health monitoring devices.

These types vary from person to person based on lifestyle, needs, and preferences.`;

} else if (userInput.includes('what is human rights')||(userInput.includes('define human  rights'))) {
    response = `Human rights are fundamental rights and freedoms that every person is entitled to simply because they are human. These rights are inherent, universal, and inalienable, meaning they apply to all people regardless of nationality, race, gender, religion, or any other status, and cannot be taken away.

Human rights include a wide range of rights, such as:

1. Civil and Political Rights: These include the right to life, freedom of speech, freedom of thought and religion, the right to privacy, the right to vote, and the right to a fair trial.
   
2. Economic, Social, and Cultural Rights: These encompass the right to work, the right to education, the right to health, the right to adequate housing, and the right to participate in cultural life.

3. Collective Rights: Rights that are held by groups, such as the right to self-determination and the rights of indigenous peoples.

Human rights are recognized and protected by international agreements such as the Universal Declaration of Human Rights (UDHR), adopted by the United Nations in 1948, and various other treaties and laws worldwide. These rights are essential for ensuring that individuals can live with dignity, freedom, and equality.`;

} else if (userInput.includes('importance of peace')||(userInput.includes('important of peace'))||(userInput.includes('benefit of peace'))) {
    response = `Peace is essential for the well-being of individuals, communities, and nations. Its importance can be seen across various aspects of life:

1. Social Stability: Peace fosters harmonious relationships within communities, reducing conflict and promoting cooperation among people. It allows for the coexistence of different groups with respect for diversity, reducing violence and social unrest.

2. Economic Growth: In peaceful environments, resources can be directed towards development, innovation, and economic opportunities rather than conflict and defense. This creates conditions for prosperity, job creation, and improved standards of living.

3. Human Rights and Freedom: Peace allows for the protection and promotion of human rights, including freedom of expression, religion, and movement. In peaceful societies, individuals can live without fear of persecution or violence.

4. Education and Development: In a peaceful society, children and adults can access education and other forms of personal development without the interruptions and dangers of war or violence. This leads to more informed, capable, and engaged citizens.

5. Health and Well-being: Peaceful environments promote physical and mental well-being. The absence of violence reduces injury, trauma, and stress, allowing people to live healthier, happier lives.

6. Global Cooperation: Peace encourages international collaboration and dialogue, enabling nations to address global challenges such as climate change, poverty, and disease through collective efforts rather than through competition or conflict.

7. Environmental Sustainability: In peaceful societies, attention can be given to preserving the environment and using natural resources responsibly, rather than depleting them in conflicts.

Overall, peace is crucial for the sustained growth, health, and stability of both individuals and society as a whole, creating conditions for a more just and equitable world.`;

} else if (userInput.includes('what is dialogue')||(userInput.includes('dialogue'))) {
    response = `Peace is essential for the well-being of individuals, communities, and nations. Its importance can be seen across various aspects of life:

1.Social Stability: Peace fosters harmonious relationships within communities, reducing conflict and promoting cooperation among people. It allows for the coexistence of different groups with respect for diversity, reducing violence and social unrest.

2.Economic Growth: In peaceful environments, resources can be directed towards development, innovation, and economic opportunities rather than conflict and defense. This creates conditions for prosperity, job creation, and improved standards of living.

3.Human Rights and Freedom: Peace allows for the protection and promotion of human rights, including freedom of expression, religion, and movement. In peaceful societies, individuals can live without fear of persecution or violence.

4.Education and Development: In a peaceful society, children and adults can access education and other forms of personal development without the interruptions and dangers of war or violence. This leads to more informed, capable, and engaged citizens.

5.Health and Well-being: Peaceful environments promote physical and mental well-being. The absence of violence reduces injury, trauma, and stress, allowing people to live healthier, happier lives.

6.Global Cooperation: Peace encourages international collaboration and dialogue, enabling nations to address global challenges such as climate change, poverty, and disease through collective efforts rather than through competition or conflict.

7.Environmental Sustainability: In peaceful societies, attention can be given to preserving the environment and using natural resources responsibly, rather than depleting them in conflicts.

Overall, peace is crucial for the sustained growth, health, and stability of both individuals and society as a whole, creating conditions for a more just and equitable world.`;

} else if (userInput.includes('what is social justice')||(userInput.includes('social justice'))) {
    response = `Social justice refers to the concept of creating a fair and equal society where everyone has access to the same rights, opportunities, and resources, regardless of their background, identity, or social status. It is centered on the idea that all individuals should be treated with dignity, respect, and fairness, and that inequalities and injustices in society should be addressed and corrected.

Social justice encompasses several key principles:

1. Equity: Ensuring that everyone has access to the necessary resources and opportunities based on their needs, recognizing that some individuals or groups may require more support than others to achieve fairness.

2. Equality: Providing the same legal, political, and social rights to all people, regardless of their race, gender, age, religion, socioeconomic status, or other characteristics.

3. Access to Resources: Ensuring that everyone has access to essential resources such as education, healthcare, housing, and employment opportunities.

4. Participation: Promoting the inclusion of all individuals in decision-making processes that affect their lives, ensuring their voices are heard and their interests represented.

5. Rights and Protection: Upholding and protecting individuals' basic rights, such as freedom of speech, the right to vote, and protection from discrimination, violence, and exploitation.

6. Correcting Injustices: Addressing and redressing historical and systemic inequalities, such as racism, sexism, poverty, and other forms of discrimination, to create a more just and balanced society.

Social justice is fundamental to building inclusive, cohesive, and peaceful communities where everyone can thrive. It involves ongoing efforts to challenge oppression and create systems that promote fairness, respect, and equal opportunities for all.`;

} else if (userInput.includes('what is institution')||(userInput.includes('institution'))) {
    response = `An institution is an established organization, system, or structure that governs behavior and practices within a society. Institutions are fundamental to how societies function and help maintain order, stability, and continuity in various aspects of life. They can be formal or informal and exist in different forms, such as legal, educational, political, religious, economic, or social systems.

Types of institutions include:

1. Educational Institutions: Schools, universities, and other entities that provide education and promote learning and knowledge.
   
2. Political Institutions: Structures like governments, parliaments, courts, and agencies that create and enforce laws, manage governance, and maintain political order.

3. Religious Institutions: Churches, temples, mosques, or other religious organizations that support and promote religious beliefs and practices.

4. Economic Institutions: Entities like banks, corporations, markets, and regulatory bodies that organize and regulate economic activity, trade, and finance.

5. Social Institutions: Family, marriage, and community organizations that play roles in organizing social relationships, norms, and practices.

Institutions shape human behavior, set rules, and provide frameworks that guide societal interactions, allowing communities to function effectively and achieve collective goals.`;

} else if (userInput.includes('what is law')||(userInput.includes('define law'))) {
    response = `Law is a system of rules and principles established by a governing authority to regulate behavior and maintain order within a society. It provides a framework for resolving disputes, protecting rights, and ensuring justice. Laws are created, enforced, and interpreted by various institutions, including legislative bodies, courts, and regulatory agencies.

Key aspects of law include:

1. Rules and Regulations: Laws consist of formal rules and guidelines that dictate acceptable behavior and outline the consequences for violations. These rules cover various aspects of life, including criminal conduct, contracts, property rights, and family matters.

2. Enforcement: Laws are enforced by law enforcement agencies, such as the police, and judicial bodies, such as courts. Enforcement ensures that individuals and entities adhere to the legal standards and face consequences for non-compliance.

3. Legislation: Laws are created through legislative processes by elected bodies such as parliaments or congresses. These bodies debate, draft, and pass laws that address societal needs and issues.

4. Judiciary: The judiciary interprets and applies laws through court decisions. Judges and courts resolve legal disputes, ensure that laws are applied consistently, and protect individuals' rights.

5. Rights and Responsibilities: Laws establish rights and responsibilities for individuals and organizations. They define what is legally permissible and protect fundamental freedoms and entitlements.

6. Legal Systems: Different countries and regions have their own legal systems and traditions, which can include common law, civil law, religious law, or a combination of these.

7. Justice and Fairness: Law aims to promote justice and fairness by providing mechanisms for resolving disputes, protecting rights, and ensuring accountability. It strives to balance individual interests with the common good.

Overall, law plays a crucial role in shaping social order, protecting individuals and communities, and facilitating the functioning of society.`;

} else if (userInput.includes('types of law')||(userInput.includes('type of law'))) {
    response = `Law can be categorized into various types based on its functions, sources, and the areas it regulates. Here are some major types of law:

1. Criminal Law: Governs offenses against the state or public, defining crimes and prescribing punishments. It involves the prosecution of individuals or entities accused of committing criminal acts, such as theft, assault, or fraud.

2. Civil Law: Deals with disputes between individuals or organizations, typically involving claims for damages or remedies. It includes areas such as contract law, tort law, property law, and family law.

3. Constitutional Law: Concerns the interpretation and implementation of a country's constitution. It addresses the structure of government, the distribution of powers, and the protection of fundamental rights and liberties.

4. Administrative Law: Regulates the actions and decisions of government agencies. It involves the legal principles governing the administration and regulation of federal and state agencies.

5. International Law: Governs relations between sovereign states and international organizations. It includes treaties, conventions, and customary laws that regulate issues like diplomacy, trade, and human rights.

6. Commercial Law: Also known as business law, it covers legal aspects related to business and commerce, including company formation, contracts, sales, and bankruptcy.

7. Labor and Employment Law: Regulates the relationship between employers and employees, including issues such as wages, working conditions, discrimination, and labor rights.

8. Family Law: Deals with legal issues related to family relationships, such as marriage, divorce, child custody, adoption, and inheritance.

9. Property Law: Concerns the ownership and use of property, including real estate, personal property, and intellectual property rights.

10. Environmental Law: Focuses on laws and regulations aimed at protecting the environment and natural resources. It covers issues such as pollution control, conservation, and land use.

11. Immigration Law: Regulates the process of immigration, including the rights and obligations of immigrants and the criteria for entering and staying in a country.

12. Health Law: Addresses legal issues related to healthcare and public health, including regulations on medical practice, patient rights, and health policies.

13. Intellectual Property Law: Protects creations of the mind, such as inventions, literary and artistic works, trademarks, and patents. It ensures that creators can control and benefit from their work.

Each type of law plays a crucial role in regulating different aspects of society and ensuring that legal standards are maintained across various areas of life.`;

} else if (userInput.includes('what is human trafficking')||(userInput.includes('define human trafficking'))) {
    response = `Human trafficking is the illegal act of recruiting, transporting, transferring, harboring, or receiving people through force, fraud, or coercion for the purpose of exploitation. It is a severe violation of human rights and involves various forms of exploitation, including forced labor, sexual exploitation, involuntary servitude, and organ trafficking.

Key elements of human trafficking include:

1. Exploitation: Victims are exploited in various ways, such as forced labor, sexual exploitation, domestic servitude, forced begging, or even organ removal.

2. Coercion, Fraud, or Force: Traffickers often use threats, deception, violence, or manipulation to control victims. They may promise victims better job opportunities or a better life but instead trap them in exploitative situations.

3. Lack of Consent: Victims of human trafficking are often tricked or coerced into situations where they are not free to leave or make their own choices.

4. Vulnerable Populations: Traffickers often target individuals who are vulnerable due to factors like poverty, lack of education, conflict, or displacement. Women, children, and migrants are particularly susceptible to being trafficked.

Human trafficking is a global issue affecting millions of people, and it can occur both within countries and across international borders. It is often linked to organized crime and requires coordinated efforts between governments, law enforcement agencies, and international organizations to combat and prevent it.`;

} else if (userInput.includes('consequences of human trafficking')||(userInput.includes('demerit of human trafficking'))) {
    response = `The consequences of human trafficking are severe and far-reaching, impacting individuals, families, and societies as a whole. Here are some of the major consequences:

1. Physical and Psychological Harm: Victims often endure severe physical abuse, sexual violence, and poor living conditions. The trauma can lead to long-term psychological effects, such as post-traumatic stress disorder (PTSD), anxiety, depression, and other mental health issues.

2. Loss of Freedom and Autonomy: Victims are deprived of their freedom and autonomy. They are often controlled through threats, manipulation, or violence, stripping them of their ability to make their own choices.

3. Economic Exploitation: Victims are often forced to work under exploitative conditions with little to no pay. This economic exploitation can have lasting financial impacts, both on the victims and on economies where such practices are prevalent.

4. Social Stigma and Isolation: Victims may face stigma and isolation from society due to their experiences. They might struggle with reintegration into society and face difficulties in rebuilding their lives and relationships.

5. Health Issues: The physical and sexual abuse, poor living conditions, and lack of access to medical care can result in serious health problems, including chronic diseases, infections, and reproductive health issues.

6. Legal and Criminal Consequences: Victims might be involved in criminal activities as a result of being trafficked, leading to potential legal troubles. They may also face challenges accessing justice and legal protection due to fear, trauma, or lack of resources.

7. Impact on Families and Communities: Human trafficking can disrupt families and communities, causing emotional distress and economic hardship. It can also contribute to social instability and perpetuate cycles of exploitation and poverty.

8. Economic Costs: The costs associated with human trafficking include the need for medical care, legal services, and rehabilitation for victims. Additionally, the economic impact on businesses and economies that tolerate or are complicit in trafficking can be significant.

Combating human trafficking requires a comprehensive approach, including prevention, protection, prosecution, and partnership efforts to support victims, hold traffickers accountable, and address the root causes of trafficking.`;

} else if (userInput.includes('factors responsible for human trafficking')||(userInput.includes('what are those factors responsible for human trafficking'))) {
    response = `Human trafficking is driven by a complex interplay of factors, often deeply rooted in societal, economic, and political conditions. Key factors responsible for human trafficking include:

1. Poverty: Economic instability and extreme poverty can make individuals and families vulnerable to trafficking. Desperate conditions may lead people to seek seemingly better opportunities, making them easy targets for traffickers.

2. Lack of Education: Limited access to education can restrict economic opportunities and increase vulnerability. Education helps individuals make informed decisions and recognize exploitative situations.

3. Political Instability and Conflict: Wars, conflicts, and political instability can displace people, creating environments where traffickers exploit vulnerable populations, including refugees and internally displaced persons.

4. Discrimination and Social Inequality: Marginalized groups, including women, children, and minorities, are more susceptible to trafficking due to systemic discrimination and lack of protection. Social and economic inequalities contribute to their vulnerability.

5. Weak Legal and Law Enforcement Systems: Inadequate legal frameworks, enforcement mechanisms, and corruption can hinder efforts to combat trafficking. Weak systems make it easier for traffickers to operate with impunity.

6. Demand for Exploitative Services: The demand for cheap labor, sexual services, and other exploitative practices fuels human trafficking. Industries that rely on low-cost, exploitative labor contribute to the problem.

7. Lack of Awareness: Limited awareness about human trafficking and its signs can result in insufficient recognition and response. Education and awareness campaigns are crucial for identifying and preventing trafficking.

8. Cultural and Societal Norms: Cultural practices and societal norms that devalue certain groups or perpetuate harmful practices can facilitate trafficking. This includes practices like child marriage and traditional forms of servitude.

9. Organized Crime: Trafficking is often linked to organized crime networks that profit from exploiting individuals. These networks use sophisticated methods to recruit, transport, and exploit victims.

10. Corruption: Corruption among officials and law enforcement can impede efforts to combat trafficking. It can lead to trafficking rings operating with less fear of arrest or prosecution.

Addressing human trafficking requires a multifaceted approach, including improving economic conditions, strengthening legal systems, raising awareness, and providing support and protection for vulnerable populations. Collaboration among governments, NGOs, communities, and international organizations is essential to combat this grave violation of human rights.`;
    
} else if (userInput.includes('what is human resources')||(userInput.includes('define human resources'))) {
    response = `Human Resources (HR) is a department or function within an organization that is responsible for managing and supporting the people who work for the company. HR plays a crucial role in ensuring that an organization's workforce is effective, efficient, and aligned with the company's goals and values. Key functions of Human Resources include:

1. Recruitment and Staffing: HR manages the hiring process, including job postings, interviewing, and selecting candidates to fill positions within the organization. This also involves onboarding new employees and ensuring they are properly integrated into the company.

2. Employee Relations: HR handles interactions between employees and the organization, addressing issues such as conflict resolution, disciplinary actions, and employee grievances. They work to maintain a positive work environment and foster good relationships between staff and management.

3. Compensation and Benefits: HR oversees employee compensation, including salaries, wages, bonuses, and benefits such as health insurance, retirement plans, and other perks. They ensure that compensation packages are competitive and aligned with industry standards.

4. Training and Development: HR organizes and facilitates employee training and development programs to enhance skills, improve performance, and support career growth. This includes onboarding training for new hires and ongoing professional development opportunities.

5. Performance Management: HR develops and implements performance evaluation systems to assess employee performance, set goals, and provide feedback. They work to ensure that performance appraisals are fair, consistent, and aligned with organizational objectives.

6. Compliance and Legal Issues: HR ensures that the organization complies with labor laws, regulations, and industry standards. They manage employee records, handle workplace safety issues, and address legal matters related to employment.

7. Organizational Development: HR plays a role in shaping the organizational culture and structure. They work on initiatives to improve organizational effectiveness, employee engagement, and overall workplace morale.

8. Health and Safety: HR ensures that workplace health and safety standards are met, providing resources and support to maintain a safe working environment. This includes managing policies related to occupational health and safety.

9. Employee Engagement and Retention: HR works to create a positive work environment that encourages employee engagement, satisfaction, and retention. They implement strategies to motivate employees and reduce turnover.

Overall, Human Resources is essential for managing an organization's most valuable asset—its people. By handling various aspects of employment and employee management, HR contributes to the overall success and efficiency of the organization.`;

} else if (userInput.includes('types of human resources')||(userInput.includes('examples human resources'))) {
    response = `Human Resources (HR) encompasses a variety of roles and functions, each focusing on different aspects of managing and supporting employees within an organization. Here are some key types of HR roles and functions:

1. Recruitment and Staffing:
   - Recruitment Specialist: Focuses on attracting, interviewing, and hiring candidates for open positions.
   - Talent Acquisition Manager: Develops strategies to identify and acquire top talent and manages the hiring process.

2. Employee Relations:
   - Employee Relations Specialist: Manages relationships between employees and the organization, addresses grievances, and resolves conflicts.
   - HR Generalist: Handles a wide range of HR functions, including employee relations, benefits administration, and performance management.

3. Compensation and Benefits:
   - Compensation Analyst: Analyzes salary data, creates compensation structures, and ensures competitive pay practices.
   - Benefits Coordinator: Manages employee benefits programs, including health insurance, retirement plans, and other perks.

4. Training and Development:
   - Training and Development Specialist: Designs and delivers training programs to enhance employee skills and career growth.
   - Learning and Development Manager: Oversees the development and implementation of training strategies and programs.

5. Performance Management:
   - Performance Management Specialist: Develops and implements performance appraisal systems, sets performance goals, and provides feedback.
   - HR Manager: Often involved in performance management processes, ensuring alignment with organizational objectives.

6. Compliance and Legal:
   - HR Compliance Officer: Ensures the organization adheres to labor laws, regulations, and industry standards.
   - Legal Advisor: Provides legal guidance on employment-related issues and manages workplace legal matters.

7. Organizational Development:
   - Organizational Development Specialist: Works on improving organizational effectiveness, culture, and structure.
   - Change Management Consultant: Manages and supports organizational change initiatives and helps employees adapt to changes.

8. Health and Safety:
   - Health and Safety Coordinator: Ensures workplace safety standards are met and manages health and safety programs.
   - Occupational Health Specialist: Focuses on promoting and maintaining employee health and safety in the workplace.

9. Employee Engagement and Retention:
   - Employee Engagement Specialist: Develops programs and initiatives to boost employee morale, satisfaction, and retention.
   - HR Business Partner: Works closely with management to align HR strategies with business goals and address employee engagement issues.

10. HR Information Systems (HRIS):
    - HRIS Analyst: Manages and maintains HR information systems, including employee data and HR software.
    - HR Systems Manager: Oversees the implementation and integration of HR technology solutions.

These roles and functions work together to ensure that HR activities are effectively managed, supporting the overall success and well-being of the organization and its employees.`;

 } else if (userInput.includes('state the diphthongs')) {
     response =`1. /eɪ/ as in "face"
 2. /aɪ/ as in "price"
 3. /ɔɪ/ as in "choice"
 4. /aʊ/ as in "mouth"
 5. /əʊ/ as in "goat"
 6. /ɪə/ as in "near"
 7. /eə/ as in "square"
 8. /ʊə/ as in "cure" `;
 } else if (userInput.includes('the element in the element table are how many')) {
     response =`118 `;
    } else if (userInput.includes('what is software')||(userInput.includes('what is sof tware'))) {
        response =`Software is a collection of programs, data, and instructions that tell a computer how to perform specific tasks. It encompasses a wide range of applications, from operating systems (like Windows or macOS) that manage hardware and provide a platform for other software, to applications (like web browsers, word processors, and games) that perform specific functions for users.

Software can be categorized into several types:

1. System Software: Includes operating systems and utility programs that help manage and control hardware and provide a platform for running application software. Examples: Windows, macOS, Linux.

2. Application Software: Programs designed to perform specific tasks or applications for users. Examples: Microsoft Office, Adobe Photoshop, web browsers.

3. Programming Software: Tools that developers use to create, debug, and maintain other software. Examples: compilers, debuggers, integrated development environments (IDEs) like Visual Studio Code.

4. Middleware: Software that connects different applications or services, enabling them to communicate and work together. Examples: database management systems (DBMS), message brokers.

5. Firmware: Specialized software embedded into hardware devices that provides low-level control. Examples: BIOS in computers, software in routers.

In essence, software is essential for making hardware functional and for enabling a wide range of digital tasks and activities.`;
    } else if (userInput.includes('software can also be called')||(userInput.includes('soft ware can also be called'))) {
        response =`Software can also be referred to by several other terms, depending on the context:

1. Programs: Individual applications or pieces of software designed to perform specific tasks.
2. Applications: Often used interchangeably with software, especially in the context of end-user software like word processors or games.
3. Applications Software: A category of software designed for end-users to perform specific tasks, such as office productivity or graphic design.
4. Code: The actual instructions written in programming languages that make up software.
5. System Software: Refers to software that manages and operates the hardware, like operating systems and utility programs.
6. Firmware: Specialized software embedded in hardware devices to control their functions.
7. Programs and Apps: Commonly used terms in casual contexts to describe software, especially on mobile devices and computers.

In general, these terms are used to describe different aspects or types of software, but they all refer to the same basic concept of instructions and data that enable computers to perform tasks.`;
    } else if (userInput.includes('two element of computer are')||(userInput.includes('what are the two element of computer'))) {
        response =`The two primary elements of a computer are:

1. Hardware: This refers to the physical components of a computer system. Key hardware elements include:
   - Central Processing Unit (CPU): The brain of the computer that performs calculations and executes instructions.
   - Memory (RAM): Temporary storage used to hold data and instructions that the CPU needs while performing tasks.
   - Storage: Devices like hard drives (HDDs) or solid-state drives (SSDs) used for long-term data storage.
   - Input Devices: Hardware used to enter data into the computer, such as keyboards, mice, and scanners.
   - Output Devices: Hardware used to display or produce results from the computer, such as monitors and printers.
   - Motherboard: The main circuit board that houses the CPU, memory, and other essential components, and allows them to communicate with each other.

2. Software: This refers to the non-physical components of a computer system. It includes:
   - System Software: Includes operating systems (like Windows, macOS, Linux) and utility programs that manage hardware and provide a platform for running application software.
   - Application Software: Programs designed to perform specific tasks for users, such as word processors, web browsers, and games.
   - Firmware: Specialized software embedded into hardware devices to control their functions, often providing low-level control.

Together, hardware and software work in tandem to perform computing tasks and enable various functionalities.`;
    } else if (userInput.includes('what is the full meaning of edsac')||(userInput.includes('edsac'))) {
        response =`EDSAC stands for Electronic Delay Storage Automatic Calculator. It was one of the early electronic computers, designed and built at the University of Cambridge in the United Kingdom. EDSAC was notable for being one of the first computers to use stored programs, where both the data and instructions could be stored in memory, making it a significant advancement in computing technology. It became operational in 1949 and played a crucial role in the early development of computer science.`;
    } else if (userInput.includes('what is the full meaning of univac')||(userInput.includes('univac'))) {
        response =`UNIVAC stands for UNIVersal Automatic Computer. It was one of the earliest commercial computers and was developed by J. Presper Eckert and John Mauchly, who were also involved in the development of the ENIAC. The first UNIVAC I computer was delivered in 1951 and is known for being the first computer designed for business and administrative use. UNIVAC systems were widely used for a variety of applications, including business data processing and scientific research.`;
    } else if (userInput.includes('what is the full meaning of edvac')||(userInput.includes('edvac'))) {
        response =`EDVAC stands for Electronic Discrete Variable Automatic Computer. It was one of the early electronic computers, designed by John Presper Eckert and John Mauchly. Unlike its predecessor, ENIAC, which used decimal arithmetic, EDVAC was designed to use binary arithmetic and to store programs in memory. This concept of storing programs was a significant advancement and became a fundamental principle in computer architecture. EDVAC was developed in the early 1950s and contributed to the development of the stored-program concept that is central to modern computing.`;
    } else if (userInput.includes('eniac')||(userInput.includes('what is the full meaning of eniac'))) {
        response =`ENIAC stands for Electronic Numerical Integrator and Computer. It was one of the earliest general-purpose electronic digital computers, developed during World War II by John Presper Eckert and John Mauchly. ENIAC was designed to perform complex calculations for artillery trajectory tables and other scientific computations. It became operational in 1945 and was a significant milestone in the history of computing, demonstrating the potential of electronic computers for various applications.`;
    } else if (userInput.includes('what is aplication software')||(userInput.includes('what is aplication soft ware'))) {
        response =`A category of software designed for end-users to perform specific tasks, such as office productivity or graphic design.`;
    } else if (userInput.includes('what is code')||(userInput.includes('code'))) {
        response =`Code refers to a set of instructions written in a programming language that a computer can understand and execute. It's a way of telling a computer what to do, from performing calculations to processing data and interacting with users.

Here are some key aspects of code:

1. Source Code: The human-readable instructions written by programmers using programming languages like Python, JavaScript, Java, or C++. This code needs to be translated into machine language by a compiler or interpreter before it can be executed by a computer.

2. Machine Code: The low-level code that consists of binary instructions (0s and 1s) directly understood by the computer's CPU. Machine code is generated from source code by compilers or interpreters.

3. Programming Languages: Languages used to write code, each with its own syntax and rules. Examples include Python, JavaScript, Java, C++, and many others.

4. Codebase: The entire collection of source code files that make up a software application or system.

5. Algorithms: The specific set of steps or procedures defined in the code to solve a problem or perform a task.

6. Code Snippets: Small pieces of code that perform a specific function and can be reused in different programs or contexts.

In essence, code is the fundamental building block of software and applications, allowing programmers to create and control digital processes and functionalities.`;
 } else if (userInput.includes('state them') ||(userInput.includes('state all the element in the element table'))||(userInput.includes('states all the elements in the elements table.'))||(userInput.includes('state all the elements in the elements table'))) {
     response =` Here is a list of all the elements in the periodic table, along with their atomic numbers and symbols:
 
 1. Hydrogen (H) - 1
 2. Helium (He) - 2
 3. Lithium (Li) - 3
 4. Beryllium (Be) - 4
 5. Boron (B) - 5
 6. Carbon (C) - 6
 7. Nitrogen (N) - 7
 8. Oxygen (O) - 8
 9. Fluorine (F) - 9
 10. Neon (Ne) - 10
 11. Sodium (Na) - 11
 12. Magnesium (Mg) - 12
 13. Aluminum (Al) - 13
 14. Silicon (Si) - 14
 15. Phosphorus (P) - 15
 16. Sulfur (S) - 16
 17. Chlorine (Cl) - 17
 18. Argon (Ar) - 18
 19. Potassium (K) - 19
 20. Calcium (Ca) - 20
 21. Scandium (Sc) - 21
 22. Titanium (Ti) - 22
 23. Vanadium (V) - 23
 24. Chromium (Cr) - 24
 25. Manganese (Mn) - 25
 26. Iron (Fe) - 26
 27. Cobalt (Co) - 27
 28. Nickel (Ni) - 28
 29. Copper (Cu) - 29
 30. Zinc (Zn) - 30
 31. Gallium (Ga) - 31
 32. Germanium (Ge) - 32
 33. Arsenic (As) - 33
 34. Selenium (Se) - 34
 35. Bromine (Br) - 35
 36. Krypton (Kr) - 36
 37. Rubidium (Rb) - 37
 38. Strontium (Sr) - 38
 39. Yttrium (Y) - 39
 40. Zirconium (Zr) - 40
 41. Niobium (Nb) - 41
 42. Molybdenum (Mo) - 42
 43. Technetium (Tc) - 43
 44. Ruthenium (Ru) - 44
 45. Rhodium (Rh) - 45
 46. Palladium (Pd) - 46
 47. Silver (Ag) - 47
 48. Cadmium (Cd) - 48
 49. Indium (In) - 49
 50. Tin (Sn) - 50
 51. Antimony (Sb) - 51
 52. Tellurium (Te) - 52
 53. Iodine (I) - 53
 54. Xenon (Xe) - 54
 55. Cesium (Cs) - 55
 56. Barium (Ba) - 56
 57. Lanthanum (La) - 57
 58. Cerium (Ce) - 58
 59. Praseodymium (Pr) - 59
 60. Neodymium (Nd) - 60
 61. Promethium (Pm) - 61
 62. Samarium (Sm) - 62
 63. Europium (Eu) - 63
 64. Gadolinium (Gd) - 64
 65. Terbium (Tb) - 65
 66. Dysprosium (Dy) - 66
 67. Holmium (Ho) - 67
 68. Erbium (Er) - 68
 69. Thulium (Tm) - 69
 70. Ytterbium (Yb) - 70
 71. Lutetium (Lu) - 71
 72. Hafnium (Hf) - 72
 73. Tantalum (Ta) - 73
 74. Tungsten (W) - 74
 75. Rhenium (Re) - 75
 76. Osmium (Os) - 76
 77. Iridium (Ir) - 77
 78. Platinum (Pt) - 78
 79. Gold (Au) - 79
 80. Mercury (Hg) - 80
 81. Thallium (Tl) - 81
 82. Lead (Pb) - 82
 83. Bismuth (Bi) - 83
 84. Polonium (Po) - 84
 85. Astatine (At) - 85
 86. Radon (Rn) - 86
 87. Francium (Fr) - 87
 88. Radium (Ra) - 88
 89. Actinium (Ac) - 89
 90. Thorium (Th) - 90
 91. Protactinium (Pa) - 91
 92. Uranium (U) - 92
 93. Neptunium (Np) - 93
 94. Plutonium (Pu) - 94
 95. Americium (Am) - 95
 96. Curium (Cm) - 96
 97. Berkelium (Bk) - 97
 98. Californium (Cf) - 98
 99. Einsteinium (Es) - 99
 100. Fermium (Fm) - 100
 101. Mendelevium (Md) - 101
 102. Nobelium (No) - 102
 103. Lawrencium (Lr) - 103
 104. Rutherfordium (Rf) - 104
 105. Dubnium (Db) - 105
 106. Seaborgium (Sg) - 106
 107. Bohrium (Bh) - 107
 108. Hassium (Hs) - 108
 109. Meitnerium (Mt) - 109
 110. Darmstadtium (Ds) - 110
 111. Roentgenium (Rg) - 111
 112. Copernicium (Cn) - 112
 113. Nihonium (Nh) - 113
 114. Flerovium (Fl) - 114
 115. Moscovium (Mc) - 115
 116. Livermorium (Lv) - 116
 117. Tennessine (Ts) - 117
 118. Oganesson (Og) - 118
 
 These elements are organized in the periodic table based on their atomic number, electron configurations, and recurring chemical properties.`;
 } else if (userInput.includes('what is adventure')) {
     response =` Adventure is an exciting or unusual experience that often involves a degree of risk or uncertainty. It typically includes exploration, discovery, and undertaking activities that are outside one's usual routine, providing a sense of thrill and excitement. Adventures can take many forms, ranging from physical and outdoor activities to new experiences in various aspects of life`;
 } else if (userInput.includes('what is phonography')) {
     response =` Phonography refers to the representation of vocal sounds through written symbols or notation. The term can be interpreted in a few different contexts:
 
 1. Phonetic Writing:
    - In linguistics, phonography involves the use of symbols to represent the sounds of speech. This is done through phonetic alphabets, such as the International Phonetic Alphabet (IPA), which provides a consistent and standardized way to transcribe the sounds of any spoken language.
 
 2. Early Sound Recording:
    - Historically, phonography also refers to early methods of sound recording. Thomas Edison’s phonograph, invented in 1877, was one of the first devices capable of recording and reproducing sound. The phonograph used a needle to engrave sound waves onto a rotating cylinder, which could then be played back.
 
 3. Shorthand Systems:
    - In another context, phonography can refer to certain shorthand systems, such as Pitman shorthand, which are designed to represent spoken words quickly and efficiently through a system of phonetic symbols.
 
  Examples:
 
 - Phonetic Writing: The word "cat" in IPA is transcribed as /kæt/, accurately representing the sounds of the word.
 - Early Sound Recording: Edison's phonograph allowed people to listen to recorded voices and music for the first time.
 - Shorthand Systems: Pitman shorthand uses symbols to represent sounds, allowing for rapid writing, often used by stenographers and reporters.
 
  Significance:
 
 - Linguistics: Phonography helps linguists study and analyze the sounds of different languages, facilitating accurate pronunciation guides and language teaching.
 - Historical Technology: Phonography in the context of sound recording represents a major milestone in the history of audio technology, paving the way for modern recording and playback devices.
 - Efficiency in Writing: Shorthand systems provide a practical tool for note-taking and transcription, significantly speeding up the process of writing spoken language.
 
 Phonography, in its various forms, has played a crucial role in communication, language study, and technology.`;
 } else if (userInput.includes('what is execution')) {
     response =`Execution typically refers to the act of carrying out or implementing something. The meaning can vary depending on the context:
 
 1. Legal Context: In legal terms, execution often refers to the carrying out of a death sentence or the enforcement of a court judgment.
 
 2. Project Management/Business: In a business or project management context, execution means the implementation of a plan or strategy. It involves taking the necessary actions to complete a project or achieve a goal.
 
 3. Programming/Technology: In computing, execution refers to the process of running a program or script on a computer. When a program is executed, the computer follows the instructions in the code to perform the specified tasks.
 
 4. General Use: More broadly, execution can mean the way in which something is carried out or accomplished, like the execution of a plan or idea.
 
 The term is quite versatile, so the exact meaning usually depends on the context in which it’s used. `;
 } else if (userInput.includes('what is force')) {
     response =` "Force" is a fundamental concept with different meanings depending on the context:
 
 1. Physics: In physics, force is a vector quantity that describes an interaction that changes the motion of an object. It's measured in newtons (N) and can cause an object to accelerate, decelerate, or change direction. Newton's second law of motion states that force equals mass times acceleration (F = ma).
 
 2. Social/Political Context: Force can also refer to the use of power or coercion to achieve a result. This could be in terms of military force, law enforcement, or other forms of pressure.
 
 3. Everyday Language: More generally, force can describe any physical or metaphorical influence that causes change or action. For example, you might use physical force to push a door open, or you might talk about the "force of an argument" to describe its persuasive power.
 
 Each usage shares the core idea of force being an influence that can change a situation or state.`;
 } else if (userInput.includes('what is scorpion')) {
     response =` Scorpions are arachnids belonging to the order Scorpiones. They are known for their distinctive appearance, which includes a segmented body, a pair of grasping pincers (pedipalps), and a long, segmented tail that often curves over the back and ends in a venomous stinger. `;
 } else if (userInput.includes('what is escursion')) {
     response =`An excursion is a short journey or trip, typically undertaken for leisure, education, or exploration. It usually involves traveling to a nearby location and returning on the same day. Here are some key aspects of an excursion:
 
  Characteristics of an Excursion:
 
 1. Duration:
    - Typically short, often lasting a few hours to a single day.
    - Does not usually involve overnight stays.
 
 2. Purpose:
    - Leisure: Visiting parks, beaches, or local attractions for relaxation and enjoyment.
    - Education: School trips to museums, historical sites, or nature reserves to enhance learning.
    - Exploration: Exploring new areas, hiking trails, or scenic spots to discover and appreciate nature or local culture.
 
 3. Planning:
    - Usually involves some level of planning, such as choosing a destination, organizing transportation, and preparing for activities.
    - Can be spontaneous or planned in advance.
 
 4. Activities:
    - Can include sightseeing, hiking, picnicking, attending events, or participating in recreational activities.
    - Often designed to be enjoyable and engaging for participants.
 
  Examples of Excursions:
 
 1. School Field Trip:
    - Students visit a science museum to learn about natural history and participate in interactive exhibits.
 
 2. Family Day Out:
    - A family spends the day at a nearby beach, enjoying swimming, sunbathing, and playing beach games.
 
 3. Nature Hike:
    - A group of friends takes a hike through a local nature reserve, observing wildlife and enjoying the scenery.
 
 4. City Tour:
    - Tourists take a guided tour of a city, visiting landmarks, historical sites, and cultural attractions.
 
  Benefits of Excursions:
 
 1. Educational Value:
    - Provides hands-on learning experiences and exposure to new knowledge and environments.
 
 2. Recreation and Relaxation:
    - Offers a break from routine, promoting mental and physical well-being.
 
 3. Social Interaction:
    - Encourages bonding and socializing with family, friends, or fellow participants.
 
 4. Cultural Enrichment:
    - Enhances understanding and appreciation of different cultures, histories, and natural environments.
 
  Conclusion:
 
 Excursions are valuable for their ability to combine fun, learning, and exploration in a brief and manageable time frame. They provide opportunities to experience new places and activities without the commitment of longer trips, making them accessible and enjoyable for people of all ages. `;
 } else if (userInput.includes('what are the 7 characteristics of living things')||(userInput.includes('what are the seven characteristics of living things'))||(userInput.includes('give me the characteristics living things'))) {
     response =`The seven characteristics of living things, often summarized as MRS GREN, help distinguish living organisms from non-living matter. MRS GREN stands for Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, and Nutrition. Here is a detailed description of each characteristic:
 
 1. Movement:
    - All living things move in some way. Movement can be obvious, like animals walking or flying, or less obvious, like the growth of plants towards light or the movement of single-celled organisms.
 
 2. Respiration:
    - Respiration is the process by which living organisms convert oxygen and glucose into energy, carbon dioxide, and water. This energy is essential for all other biological processes.
 
 3. Sensitivity:
    - Sensitivity, or responsiveness, is the ability of an organism to detect and respond to changes in the environment. This includes responses to stimuli like light, temperature, and touch.
 
 4. Growth:
    - Growth is the increase in size and mass of an organism. Living things grow by producing more cells or by enlarging existing cells. This process is essential for development and maintenance.
 
 5. Reproduction:
    - Reproduction is the biological process through which organisms produce new individuals of the same species. It can be sexual, involving the combination of genetic material from two parents, or asexual, involving a single organism producing offspring identical to itself.
 
 6. Excretion:
    - Excretion is the process of removing waste products produced by metabolic activities from the body. This is crucial for maintaining homeostasis and preventing damage to the organism.
 
 7. Nutrition:
    - Nutrition is the intake of food and its subsequent breakdown into usable energy and nutrients. Organisms require nutrients to fuel their metabolic processes, grow, and repair tissues. Nutrition can be autotrophic (e.g., plants producing food through photosynthesis) or heterotrophic (e.g., animals consuming other organisms for food).
 
 These characteristics collectively define what it means to be alive and help biologists and scientists differentiate living organisms from inanimate objects or non-living matter. `;
 } else if (userInput.includes('what is land')) {
     response =`Land refers to the solid part of the Earth's surface that is not covered by water. It encompasses various types of terrain and natural features, and it plays a crucial role in human life and ecological systems. Here are some key aspects of land:
 
  Characteristics of Land:
 b nh
 1.Physical Composition:
    -Soil: The upper layer of land that supports plant life, consisting of a mixture of minerals, organic matter, gases, liquids, and countless organisms.
    -Rock: The solid mineral material forming the Earth's crust, including igneous, sedimentary, and metamorphic rocks.
 
 2.Topography:
    -Mountains: Elevated areas of land with steep slopes and significant height.
    -Hills: Smaller than mountains, with less steep slopes and lower elevation.
    -Plains: Flat or gently rolling areas of land with few changes in elevation.
    -Valleys: Low areas between hills or mountains, often with a river or stream running through them.
    -Deserts: Arid regions with minimal vegetation and low precipitation.
    -Plateaus: Elevated flat areas with steep sides, often formed by geological processes.
 
 3.Land Use:
    -Agriculture: Land used for growing crops, raising livestock, and other farming activities.
    -Residential: Land used for housing and living purposes.
    -Commercial: Land used for businesses, retail, and industrial activities.
    -Industrial: Land used for factories, warehouses, and production facilities.
    -Recreational: Land designated for parks, sports, and other leisure activities.
    -Conservation: Land set aside for preserving natural habitats and wildlife.
 
 4.Geological Features:
    -Rivers and Lakes: Bodies of freshwater that can shape and influence the land around them.
    -Canyons and Gorges: Deep, narrow valleys with steep sides, often formed by erosion.
    -Volcanoes: Landforms created by volcanic activity, including mountains with a crater formed by eruptions.
 
 5.Ecological Importance:
    -Habitats: Land provides homes for a wide range of plant and animal species, supporting diverse ecosystems.
    -Climate Regulation: Land features influence local and global climate patterns, such as temperature and precipitation.
 
 6.Legal and Economic Aspects:
    -Ownership: Land can be owned privately, publicly, or be subject to various forms of tenure and land rights.
    -Value: Land is a valuable resource for development, agriculture, and natural resource extraction.
 
 7.Human Impact:
    -Urbanization: The development of land for cities, infrastructure, and industrial activities.
    -Deforestation: The removal of forests for agriculture, logging, or development.
    -Land Degradation: The deterioration of land quality due to human activities, leading to issues like erosion, desertification, and pollution.
 
  Summary
 
 Land is a fundamental component of the Earth's surface, integral to ecosystems, human development, and various economic activities. Its diverse forms and uses reflect its importance in sustaining life, shaping our environment, and supporting societal needs. `;
 } else if (userInput.includes('what is sex')) {
     response =`Sex refers to the biological and physiological characteristics that define male and female organisms. It encompasses various aspects related to reproduction and physical differences between sexes. `;
 } else if (userInput.includes('what is a chemical bond') ||(userInput.includes('define chemical bond'))) {
     response = 'A chemical bond is an attraction between atoms that allows the formation of chemical substances containing two or more atoms.😊';
 } else if (userInput.includes('what is ionic bond')) {
     response = 'An ionic bond is a type of chemical bond that involves the electrostatic attraction between oppositely charged ions.😊';
 } else if (userInput.includes('what is a covalent bond')) {
     response = 'A covalent bond is a chemical bond that involves the sharing of electron pairs between atoms.😊';
 } else if (userInput.includes('what is crop pest')) {
     response = `A crop pest is any organism that adversely affects crops during their growth, harvest, or post-harvest stages. These pests can cause significant damage to crops, reducing yields, quality, and overall profitability for farmers. Crop pests can be insects, diseases, weeds, or other organisms.
 
  Types of Crop Pests
 
 1. Insect Pests
    - Examples:
      - Aphids: Suck sap from plants, potentially spreading diseases.
      - Caterpillars: Larvae of moths and butterflies that chew on leaves, stems, and fruits.
      - Beetles: Damage crops by feeding on leaves, stems, and roots.
    - Impact: Can lead to defoliation, stunted growth, and reduced yield.
 
 2. Diseases
    - Examples:
      - Fungal Diseases: Such as rusts, smuts, and blights that can affect leaves, stems, and fruits. Examples include wheat rust and potato blight.
      - Bacterial Diseases: Such as bacterial wilt and bacterial blight that can cause plant tissue decay and wilting.
      - Viral Diseases: Such as cucumber mosaic virus and tomato spotted wilt virus, which can lead to poor plant growth and fruit deformation.
    - Impact: Can cause lesions, wilting, and overall plant decline, leading to reduced yields.
 
 3. Weeds
    - Examples:
      - Pigweed: Competes with crops for nutrients, water, and light.
      - Canada Thistle: Aggressive growth can choke out crops and reduce yields.
    - Impact: Weeds compete with crops for resources, leading to reduced growth and yield.
 
 4. Nematodes
    - Examples:
      - Root-Knot Nematodes: Cause galls or knots on plant roots, impairing nutrient and water uptake.
      - Cyst Nematodes: Form cysts on roots, reducing plant vigor and yield.
    - Impact: Can lead to root damage, reduced nutrient uptake, and stunted growth.
 
 5. Rodents
    - Examples:
      - Rats and Mice: Feed on seeds, seedlings, and mature crops.
    - Impact: Can cause significant loss in stored grains and damage to crops in the field.
 
  Management Strategies for Crop Pests
 
 1. Cultural Control
    - Crop Rotation: Changing crops in a field each season to disrupt pest life cycles.
    - Resistant Varieties: Planting crop varieties that are resistant to specific pests or diseases.
 
 2. Mechanical Control
    - Hand-Picking: Removing pests by hand, especially for small-scale operations.
    - Traps: Using traps to catch and monitor pest populations.
 
 3. Biological Control
    - Beneficial Insects: Introducing natural predators or parasitoids, such as ladybugs for aphid control.
    - Pathogens: Using microbial agents like Bacillus thuringiensis to control certain insect pests.
 
 4. Chemical Control
    - Pesticides: Applying insecticides, fungicides, or herbicides to control pests. Careful application is necessary to avoid resistance development and environmental harm.
 
 5. Integrated Pest Management (IPM)
    - Combining Strategies: Using a combination of the above methods in a coordinated approach to manage pests sustainably and effectively.
 
 Effective pest management is crucial for maintaining healthy crops and ensuring agricultural productivity. The choice of control methods depends on the specific pest, crop type, and environmental conditions.😊`;
 
 } else if (userInput.includes('define geography')|| (userInput.includes('what is geography'))) {
     response = `Geography is the scientific study of the Earth's lands, features, inhabitants, and phenomena. It involves the analysis of spatial and temporal patterns and the understanding of the physical and human processes that shape the world's landscapes and environments.
     Geography uses various tools and methods, such as maps, geographic information systems (GIS), remote sensing, and spatial analysis, to gather, analyze, and interpret geographic data. The discipline aims to understand the complexities of our world and to address issues related to the environment, urban development, globalization, and sustainable resource management.`;
     
    } else if (userInput.includes('the first extinct animal in the world')) {
        response = `The first documented extinction of an animal due to human activity is often attributed to thedodo bird (Raphus cucullatus). The dodo was a flightless bird that lived on the island of Mauritius in the Indian Ocean.

 Key Facts about the Dodo:

1.Habitat:
   - The dodo was native to Mauritius, an island east of Madagascar in the Indian Ocean.

2.Appearance:
   - The dodo was a large bird, about 1 meter (3 feet) tall, with a distinctive large beak and a plump body. It was flightless due to its small wings and heavy body.

3.Diet:
   - The dodo primarily fed on fruits, seeds, and possibly small land animals.

4.Extinction:
   - The dodo became extinct in the late 17th century, with the last confirmed sighting around 1662.
   - Its extinction was primarily caused by human activities, such as hunting, habitat destruction, and the introduction of non-native animals (like rats, pigs, and monkeys) that preyed on dodo eggs and competed for food.

 Importance of the Dodo's Extinction:

- The extinction of the dodo is a significant historical event as it highlights the impact of human colonization and activities on native species and ecosystems.
- The dodo has since become an iconic symbol of human-caused extinction, reminding us of the fragility of wildlife and the importance of conservation efforts.`;
     

   
} else if (userInput.includes('show me an image of a cat') ||(userInput.includes('show the picture of a cat'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;
       
    } else if (userInput.includes('show me an image of nigerian map') ||(userInput.includes('show the picture of nigerian map '))) {
        const imageUrl = 'https://encrypted-tbn0.gstatic.com/imagesq=tbn:ANd9GcROi6-fF_juNeaPW1nXyW9MfFliDgK9rpuBmQ&s';
        addImage(imageUrl, 'bot');
        return;
    } else if (userInput.includes('show me an image of a bear') ||(userInput.includes('show the picture of a bear'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;
    } else if (userInput.includes('show me an image of a hippopotamus') ||(userInput.includes('show the picture of a hipopotamus'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;
    } else if (userInput.includes('show me an image of a camel') ||(userInput.includes('show the picture of a camel'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;
    } else if (userInput.includes('show me an image of a chicken') ||(userInput.includes('show the picture of a chicken'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;
    } else if (userInput.includes('show me an image of a cock') ||(userInput.includes('show the picture of a chicken'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;

    } else if (userInput.includes('show me an image of a dinosaur') ||(userInput.includes('show the picture of a dinosaur'))) {
        const imageUrl = 'https://encrypted-tbn0.gstatic.com/imagesq=tbn:ANd9GcSdsTBsoAFWGM1JjEDSVAzmVApDHs-DTi6mmg&s';
        addImage(imageUrl, 'bot');
        return;

    } else if (userInput.includes('show me an image of a dog') ||(userInput.includes('show the picture of a dog'))) {
        const imageUrl = 'https://encrypted-tbn0.gstatic.com/imagesq=tbn:ANd9GcTi9we-ro8kgoJnXILMvgcG0YEoqrx5IDT_OQ&s';
        addImage(imageUrl, 'bot');
        return;

   
    } else if (userInput.includes('show me an image of a american dolar') ||(userInput.includes('show the picture of a american dolar'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;

    } else if (userInput.includes('show me an image of a dolphin') ||(userInput.includes('show the picture of a dolphin'))) {
        const imageUrl = 'https://encrypted-tbn0.gstatic.com/imagesq=tbn:ANd9GcTg-Ji1LjkG2-edzt6yK4c3MuzCzYLWZ23cKQ&s';
        addImage(imageUrl, 'bot');
        return;

    } else if (userInput.includes('show me an image of a lion') ||(userInput.includes('show the picture of a lion'))) {
        const imageUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGBUXFhcXFRUWFRUXFRUWFhUVFhUYHSggGBolGxYVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGisdHR0tKy0tKy0tLS0rKy0rLS0rLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0rLTctNzc3K//AABEIALcBEwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAAIDBQYBBwj/xAA6EAABAwIEBAMHAwQCAQUAAAABAAIRAyEEEjFBBVFhcROBkQYiMqGxwfAU0eEHQlLxI5JyFVNigqL/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIDBAX/xAAmEQACAgEDBAMAAwEAAAAAAAAAAQIRAxIhMQQTIlEyQWEjcYEU/9oADAMBAAIRAxEAPwCjo1IRIfKDYE9hVCLGhUhXGGxlln2lT0qiANZhMcIjdOfjD5LN0KxBVjh8QgCbFNzAmIVTXpK3dVBsEBiboAq6lJDParR9NC1aSBACSmLEx1NMDgCklcaxJwVCCaTrJ6golFU2oEPa5O8RDvUL6myYUEPcE1tRQB6QckUHvr2hSYSoAq8roqQpYGgo1RChqYnkqxmJUlCokBLiD7qrHCVY1STfZAvPvIA42mVYU6By3UAMKzoPBF9NygBYCh0U9ZkEruDeFLUIO6QyClT3ITagJKK8UAXuo2YhpOkBAiXwwBcKs4lRbHVWGIqtNpsgaoGusJrYGVIw45j5pIxwbOiSqxUUoYutauh6e0KShBS02JuVSCyACaVJH0qaEwtfmj6dYFUkJsTWQoMS0WU7nJlWnKbRKYLUbZQltkVWb7qga5TRQJkuuOpoljLp72gIAALYUNWp0PoQERidyBPnCqsRjiwA5LdSB6Ssc2XQtuTbFj1MMo5p1b8/qEbTedxH0VD+tc8BzSGg6SJmP9c0VQ4jtPcDT9wvPfUZU7s7f+eDXBZYpjht6KvdXVi6oWtzC7Y/lA4mlPvDzXVg6vW9MjmzdNpVoja9E0gg2sRLXwF3HKGBRVFD+oTXVEmCOlynbXKCL1IwypGGtxGyTXbqCm1E5bJgPzyiaZtbzQVIFHUxCBEtB5Gi74l1G6pCjaZSbGkE1nSJQhqlPe9C1Xp2FDnYg810V0MXJNKBEpqpKGUkCIMikZTKNGEUtPDqSwGCpQEYcOuGgUwIqFJHUaBCGZIKPZXFtk0yWcAPJKSiZB6rrqBV2SkBVmoBzoKtKkhVmJIKlspD2VBCHxFUNBJ0CiDiFmvaXHf25pA0aDbq5/PoFLlRSVkz8YazjBho3vHp97Kq4mKQJ/5CXdGB3zKazE+4A4kA6NaAC4nQCEYeHlrQ50NDtGCS47AF2319VwTlcrZ3QjSpAuAzOp0y1xA0kHL/AHGZtAV1iKBY0e8YPS3dR8A4YKZIqZfjLmtkHlfKdEdxIlzhpbQW9bLlyzTlSOnGnVst+HwKYzCQRvt3TXhmXMDYiZ2F4vuBNvNL9KalICSLagmduVwqrBUf0zqjXBxa+HCXFxsRJ967hYmLG2hUQX39oU/RK+kRqP2PZdFNOxWJpDK5kZH3EEx1IB0Mi4T6RBuD+/ovXw5lkX6eZlxOD/CB9FReGVZNYFE+ktmZoBNNOYEQKRThQSA7QhGsYChm0SiKVkhjjSIXSVIaijcEWAO+onUq6RpJpZGiAH1KoQtZ66+mVz9OU0IZTKla1OZQhEMpoYEQppInIkgC7/QGVMOFkahW1IZro3wwQDP51UNlGVfQjZcOGla1+GYREAqrxOBi48wmpCaKF2GQzqKunsGhULqQVCBcOICsqXvBQeEE6g/KgB+MwYjqqZ2BJKu6uOBFwgMbjAASkBlfaPEeC3KPjdp0G5Xn2IJc4/k91f8AGuIOr1HOuTp0A5D85IHD4C8uiepgfuSsJZPZ0QhsEcLogQQL7uO3b8urp2F8Wowk5aTNBu4xA0TeG8OJiRygRp1y7LSUqYAiR+eglebkyeWx3QhUdyuqPaPhb/1+8qJvvnKBG5MiI30srOtgy4g5Y6/gXRQDR7xk6ADcnQRCwNSywcZBN50jpzQeJwYOtzBInYb+k6dlPgaRJMiANT/8p+QupqrQwOzmNcoNpJ3nlp6q0mQ2ZB9E6NtY5c05c14cQ2IFotsUJwuvixXNOsxjAW5suXRuxa7W53nY8lov1VLNDjEGAAQJ6Mg39ETVxoe57PDcwtFJzXFoGdp8UGIvAI3ANzYLr6W3KmjDqPjyCBNLUczCSp24IAXK9M85Fa1imp01P4KIwtEFIZB4fROOHVo2gBZQVhCQFe/DQozTRjio3hIAU01HCJcE1tNMBgamVGFSuCTWq0JkTKRRlPCFPoUgCjgbKZMEiAYULinzpKbYy1oOe0Aj5fdWOFxIO0EiLaeYTP0hHZciB+WU6rKoMe6NR5j7hMxdTl6/7TMI6JzaLmNxLWgmB9kWDVABwkmSZE6ptfBgXG30TadVzrtFibhXVDB5mzN4T1UKihpFt5mUHVsVYYikQSPVRikCVSYmV+qpfa53h0HGTLvdaO+p8hK29Hh4vK89/qViQ1zKYtJk22HIa6/TolKVIqKtmQwWADrudbZoHy7rQ4DA02j3ad+0nzJsqai9oAJInmYnyGyno40g6/8AZ5A9N15mXVJnoY0ki9a9wMFh8vuB90dQxOWLNnvmPqf2KzrsbUdo2PMkeTbIqjiSfiDo3n3fkudxaNbLavi3k2c0aa3j/wCug9CmivTaZDi+puTcMG8bN5COaDbVpDQ67C9+wifmoX0GaCbnnqfuepsmBdiq/KSCWjU2BLthE6aa9lhOM8X8dzG1nPGWS1wGxJLQ5htMQVd8V4mQ2mGm5dAA0IiCe0kx6rOcdyh8gaNF/ULfCqMcjN77KUcLSpipSaXvdq90l3WJ+HewhWuIq+I6Y0Ed7kobgmCFOjTaDMNF4iZvp5qxcxejjxJeX2cM8jewOGwFG+VNUdsuBi0szBmtReHYpGUYSdUA2RYxz6iExNXZNq10HUrpAPq1FH4yGrVZUdMlOgLFpTpUFJ6kc8J0FjiEybqN1VR+IrSIbLGg66mq1wAqoV4Q9fFEqHEqyxdi0lSmoUkaRaj1R1J7b3Q+JqkjSPJXYrhzYIvF1CcG1zZFiufUbUUjqpywQQeeypsSXNkm+60uLwbm63HMKjq0C5xBsFSaE7FwzFOgCIFif4WwwGUtlphZZtMWiICtcJVg3Iy2RLcETcaaCCRY/l1QU8QGmLeat+LP5G0LPVKRJTQmaTB4kOZEX269l5d/UbBvbU8Q+8dyZyN/xAmS46nzC9AwLnNWV/qRVqPoG0NBBsYm4Gv9x6aKZFRZ51SxxFyJ5mSCe10v1uY2Dmnp91WGiSbXPffun0GuDgDfs4AeSxcFybqbLem+o27hnEaZySeWggKcY8ZTnaWEjRrXEjzdYei7gOJtaYyOPYT8yVauxFN9j8R0EyfNogD0WEv1G0X+lO7Fs0AeBysC7oSNB+WRmDqFwN8oIMu1OUfFljnzUOO4ayZETysLf5OKiw2JaHe8ZA0EWc4aDqBf5pOKfBWprkc9pzmsRDQIpg/4ixPoqXimLzMGXn6Wg/P6K04pjTVNjDQCIG1xcfNUuKZIgR9yN78ui2xrizGf4b72f4g+lSZm94QMzeX/AIk6H5H5rX0qrXtDmGWnf7HkVg8CC2mwOMmB+eiv/Z3FZKmQ/DU05Bw09Rb/AKpYs7UtLDLhTjqRcGkpabFJVKiFS67jiCHiyr6zkVUfI1VXiasJICHEFC1Su1XSuwtIxIkyABTAJEBNlaJEah+aE01ExxUZKKHY51VRmok5qjKKA6XlNlNldCAOwuJEpJCPZvANocp6U6ELPnihVxw7FZxrdcMk0diaD/AtzVFjcBDiQNf3WlpsMJjqXNG4rsxeLoxeFX06zphbDiGDDmnYrNHCuD7qk7E0RkuNkbhcEbOUzNLhPw9MkxMDqiwod+lJ2uqP2o4I+rTLcs8yYygAHzPb6arX0cK4QUJx+uW0HxcwQBzlKx0fNXFabqdZzJ0O1tuW3ZcwY3JnmNPmpfaKg5tZxc2C6XSbSJIJHnKBpVDNr+QJ/Yd02tiosv8A9SIiL8gSPzRMZjnNsweTb+rtOeiioUjuZjW8jsT6IyvOQOPusNwN3mIntp6LB0bbgOKrVHj3iAJ0bv1J6XUOHozraAuVq5JHp+dP2TRiDJG2/WbKktiWTFha0HcEg76iQQPVVmJxMyLft1B+yIrYv3oN7fPUKvAl30WkY+yJS9HovBv+Smx3QT3GqsccwhlrEXB5EXBHmqX2LxrY8ImDJLeoOw66rQ4y4Mcl5s04zOyLuJZYfiGdjX8wCRyO48jKcH3uqPg1WxbyMjs7+QVZOqTuvYxu4pnmzVSaC31JmFW4kuUhqwNboQ4mFRA/MDrqnB0obx+ya/F9labJaDKmHdMQlUw5bqRPKUA/F3uSmCur1E6QxzeoT2UwBJcPVVr8QOV+coV1UqbsaRbVsT2QrnyhTUTC9CKDmlqJpMpzcqpp1CjqNMxKGIJdSbNtElCUlNhRqhiFZ8JxxYZVC1yMw1SFm9zQ9CwWNzi0IjxwbLEUMVluD3C0PDsYw2mCeqykmilTOcSqZXjkdl2phC8Zm26c0e/BtN489V1zso0WdllJWwnVSYfB2k6c+aLbiCbOZbnoj6LWkQLJ2wAnOAGWYVbxDK5pbmJBseo5SrbGcPm4KqauBLTe4+qqNfYm2eK+3/DcuKFKkwkljXE6/FmlxG37BZzD4JxMDSe09epXqntjhR+qbsX0ss8gx7p+Tx6LM8V9mXFmak85riJF1jPJTo2hC1ZU08jIaY2JGgAHPqVXcbx5qPA2EeQGw9fSE6jwatUp1XNBL6RYXMi7mODrtG7gW6bg20vWPf7vdNQrfkpzvYNpMGUuP5ZDYSC4kne/S/8ApQ1cQXM/IB0Wp9jeFANzPAJdpOgG5Pn9EN6U2xLdpAfCOAMrteTIJ+A8iNVVYvAupkhwgzH0PnqvVcNgQ2ncAWIMbTGnksH7b4hrXskSYeYtzESekrPHklKVFTikrKfDyIIsRoRqtvwriJq0ff8Aib7pOzt57rF4FxeGy2Mwdl65TB85+y22DwsYRhEz/d5kyln/AEeHfg5gTfvP7j6lFOeVDlggjT8/dOqOXT00rhXo5+oVSIn1VAZJU0Sutauo5wOsSoXyjnMTHMTABAciaZ5ogNUVVwSsCGq66jfUXahQ1RMCfxlx9SUKAnMdCYgim+6NGMOWJVW6oo/FKKAsDijzPqkqw1kkUBvcbWy2Cr//AFQpnFMSajiftCCoNvdZlFzQxriFccNxLpBkobBcO90Pb7zemrTyeNvor3AUBHwhS9yuC3wtR5Ah8dEvEcPiM9ZXGe62zZP0RGBZns5t+cLFl2E4WSOilp1mieaJZhwwe61CZGlx6eqiik7DmvB3SqCyArPmzdlLSDsut+qqhGB/qNQOahViIe5vcPAMerELh25qZGq0/t7h/Ewb5F2Zag7NPvejST5LM8EfLQfI91zZuUdGLgf7M4HM+qDYlrDPYuH3QHtX/T+nVl7D4dQ3JAljv/JvPqI81r/ZfDgPrOImzNO7yfsrnEOYTBA0W+FvSjHJ8mfNPGPZyvhrvb7sxnaZZcwJ3B7heg+yLGvwzCAbC/eTK3XFsJScxzXNBDgQQQCCDqCCqTh3DmUfcptysMkCTqddTO49SjqI+NjxT8qG4xoFOy8m9tb1wP8AFo+p/Zet8VHuWOi8j480vxBaNXFjBHN0AfVYdP8AI2y8GjwPAC7h9EARVANWmT/k5xcGnoQQD36LQYat4lHM3RzQbi7S0++08nAq8xGGyhrYADWgCOQED6LMUsY2jjX0TYVWtqN5FxzMeO5yA+S36nHqjq+0Y4MlSr2dqUhlA3sfzmu0aWcA8/8AR+atMThwGkjlHdVXD6vxg7O+Rj+Vl0ct6NOpj4phLsBHJMdQEKTxpTHL0DiBalLkhqlOEQ+uhcTWTQDKjkHUeu1Kige5MQn1FC+onFqY6kmAw1EzxFx7VESqETGom51FmTSUASly6oCUkAbAY4QQAL7xJ8uS5RfdV2ZS06sLIo2HAsa5jpa4tMbHUciN1tcBgqjyKga0MIk5T9tl5bgsQJEzG8WK2eC9qWU6HhUwbh13atnkRqokilwbQ4drTeDOgG3cI3A5I93TmvLcPjX1HAZiTeL7dFrKHHW0sMASC69h3UNUPk1lSCP2QLnXka+nqsnhvaq4EwCRPZaHEYoZM4NjpyUTbsuKK/H8WbTMRB6alS8OxLql3GAfWVkcdVc6qct43V5gK/h0xnN/52VNbAmXXE8NnY5hIhzXDycII+a8y9mahs07gT3AOnoVtX8cBMajnKyuHpZaz2sktzuLT0+IX2+KFz506Rtie7NR7N43I+o0m2UO9DH3KsMbjabhIiVk6rnMcHg2yu8/eH2lSU+JMFiFp0vx/ozz/IOxRzXG2qiqEhpcdmmOe2ikolhAc2SDudj2XMfVkbW1jRX1EvBkYY+aKTjDzBbt+zZIXnvCsH4uLaeVZj46NqtJv2XovEqJ94gST9NfLQLDey7f+Uv/AMQT5xb5rjwuk2dmRWeq1MG57gALeX1XnH9VsG/D18LVEAxUg7E03U3Cf+61/C+MhpOab8zYeSzH9U8aK1KjBByVCBAIs9l582hehT/w4Vsyy4VjvGpNedwDGkSP5QVM/wDM4AfE2fQx9032Zk0KTh/7NMObbVjQMw6wBPZGFoFQPPuiCPN2i4Irt5Tsk9eMYRGqDxGJgKzdhszSRruqTFU4N16S3OFgNfEuJSzEi66Sm5wrEcIAQdcckcYUVWmChCogoVCu16k6JxpQoqlJAA7imRKINEwuU2J2BCKZXHNhFOZyUD2lFgQFJSJJiLkHYyOsSP8A8zZdZEAzrzBB9CE1wyj+6b2BEx900Zp/u6XE/VcSys6e2guk/lB8/wB0S3EKs8MiT9IJ9E9lZ+31AtoPun3WLtot6WLggg32uu1uIl0X7dVTNru2n6FdZihuJ590dxj0ItcPiiDOvmFdYPjLwACZA27rM5wRZvpJF/JQ1cV4cEAct50mLeWqO5fI9Ho19Tih1AA7IepxNx1cT3VBSxzjqIHMkfZFiptv5StFJUZtMP8AHlH8LeAHlxgSNNTbQ9LfNZ01jaSAJuZA36kXU/F67TTd4Bl4b7t5k6kRsYBE9QsM71JJGuFU7Zc47FgkRUbNvdkXmQRHZVuJrZXEbj8HyQH6wMrMu0sDD4jjEycuUkAydTtsmYqvnqPezN4Zy5ZBBJA94iYtp6FR0ycZO+GXnqSVcl3geKmzC7K3nCLq13OY0sJgu+IjZpiPqsvLuX0VjwnH0nNdTq1Q3KZyuORuUXgE6ydbrXqd4bGeDaW5oaNdjwAS2bg3sY2PK6zHs9w1zDUzMvmeB1AcduVrd1Cca39TkYGZC0lrh8IdNssDYA37BGcI40G0g551JEmYIDwwOA2zE94uuHRLSdeqNkFZ5a4jzHK6reNYY1aZawS6xA5xrHWJR2PdmqOLdz1jylNwrHNe10aEHUc16MJ/xq+TilHz24IfZrEkUKd4Gk9nEStXXpZspIiCYMb5bOssu/BlpcGw1pc5wk6Z3F0fMrQM4/TBHul1gIJAuAZOhXP1HlpcTbD42mCnEBkg36f6Vbi6rCORTeI4htWo585c14BBHqhSwX1PmuiE0oq+TCUHbohcmkgIhgby+6fkHIDyCrvL0HaYNlJS8A6wUSAOZ8v4TmgzoPuByS734PtfoE6keR9EhSPIqzDLWvG0fUlcP5/tLvP0HaA2ttt6hROwx6fn4fRWLncvtHmJ6JpPNLusehFe3BT/AHfIfunHhzTu4/I+kIk0vyfvP5dPLzzi3Tfmlrl7DRErTw9vJ3q0LqONSNz8/sF1GuXsNCKFtfLMNg8wVM2o6JDrRew87pJKB2OZVJ5d1J4pmNUkkDHsdtvCbXAjQD1PkkkkNkTHuglpED4raHbuEc6sCImItGo8uSSSJDRJlA53sNvpblspG1SNCbHT5JJIBhDqI3AgzbUb/wAoPDNaTmBIE9SRtfnokkpK9FtTxPy1N9dbwR8knusdSOh5xzd1G/qkkgRMyhYFokHmbn3jqe5KfSwJcJLQBtH115BJJAyJ2BpmCWNJ2dHSbSJ+ii8NoktYBtcCdR8t0kkCZGKre+t4Cc7EMM6juB5dl1JMRxlRp1AIt3HpCfToNI0+nYi4SSQxnG4Vv+I/1uutwTD/AGC/yH59FxJKwG1MA2LT0Hlqq91ODe3T/XRdSQmBIKc6AdNxtrKRMa/RcSStgkcFQG1zfsnwf5skktPokTWGdo+ia8k8rTz1lcSUoGPBIjT5+Sj+c9+f8JJKkIQPQfnkkkkiwP/Z';
        addImage(imageUrl, 'bot');
        return;
    } else if (userInput.includes('show me an image of a horse') || userInput.includes('show the image of a horse')) {
        const imageUrl = 'data:image/jpeg;base64,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'; // Example URL, replace with a valid URL
        addImage(imageUrl, 'bot');
        return;
    } else if (userInput.includes('show me an image of an elephant') ||(userInput.includes('show the picture of a elephant'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return

    } else if (userInput.includes('show me an image of a fox') ||(userInput.includes('show the picture of a fox'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;
        
    } else if (userInput.includes('show me an image of a gagua') ||(userInput.includes('show the picture of a gagua'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;
    } else if (userInput.includes('show me an image of a jaguar') ||(userInput.includes('show the picture of a jagua'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;


    } else if (userInput.includes('show me an image of a cow') ||(userInput.includes('show the picture of a cow'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;
    } else if (userInput.includes('show me an image of a bull') ||(userInput.includes('show the picture of a bull'))) {
        const imageUrl = 'data:image/jpeg;base64,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';
        addImage(imageUrl, 'bot');
        return;
     } else if (userInput.includes('show me a multiplication table') ||(userInput.includes('show me the multiplication table'))) {
         const tableData = [
             ['x', '1', '2', '3', '4', '5'],
             ['1', '1', '2', '3', '4', '5'],
             ['2', '2', '4', '6', '8', '10'],
             ['3', '3', '6', '9', '12', '15'],
             ['4', '4', '8', '12', '16', '20'],
             ['5', '5', '10', '15', '20', '25'],
         ];
         addTable(tableData, 'bot');
         return;
     } else if (userInput.includes('show me the 36 state and capital of nigeria')||(userInput.includes('show me the 36 states and capital of nigeria'))) {
         const tableData = [
             ['State', 'Capital'],
             ['Abia', 'Umuahia'],
             ['Adamawa', 'Yola'],
             ['Akwa Ibom', 'Uyo'],
             ['Anambra', 'Awka'],
             ['Bauchi', 'Bauchi'],
             ['Bayelsa', 'Yenagoa'],
             ['Benue', 'Makurdi'],
             ['Borno', 'Maiduguri'],
             ['Cross River', 'Calabar'],
             ['Delta', 'Asaba'],
             ['Ebonyi', 'Abakaliki'],
             ['Edo', 'Benin City'],
             ['Ekiti', 'Ado-Ekiti'],
             ['Enugu', 'Enugu'],
             ['Gombe', 'Gombe'],
             ['Imo', 'Owerri'],
             ['Jigawa', 'Dutse'],
             ['Kaduna', 'Kaduna'],
             ['Kano', 'Kano'],
             ['Katsina', 'Katsina'],
             ['Kebbi', 'Birnin Kebbi'],
             ['Kogi', 'Lokoja'],
             ['Kwara', 'Ilorin'],
             ['Lagos', 'Ikeja'],
             ['Nasarawa', 'Lafia'],
             ['Niger', 'Minna'],
             ['Ogun', 'Abeokuta'],
             ['Ondo', 'Akure'],
             ['Osun', 'Oshogbo'],
             ['Oyo', 'Ibadan'],
             ['Plateau', 'Jos'],
             ['Rivers', 'Port Harcourt'],
             ['Sokoto', 'Sokoto'],
             ['Taraba', 'Jalingo'],
             ['Yobe', 'Damaturu'],
             ['Zamfara', 'Gusau'],
             ['Federal Capital Territory', 'Abuja']
         ];
         addTable(tableData, 'bot');
         return;
     } else if (userInput.includes('show me a table of elements')) {
         const tableData = [
          ['Element', 'Symbol', 'Atomic Number'],
         ['Hydrogen', 'H', '1'],
         ['Helium', 'He', '2'],
         ['Lithium', 'Li', '3']
         ];
         addTable(tableData, 'bot');
         return;
     }else if (userInput.includes('laconic')) {
         response = 'Laconic: using very few words.';
    }else if (userInput.includes('kway') ||(userInput.includes("kiwi"))) {
        response = 'udo';
     } else if (userInput.includes('malaise')) {
         response = 'Malaise: a general feeling of discomfort, illness, or unease whose exact cause is difficult to identify.';
     } else if (userInput.includes('nefarious')) {
         response = 'Nefarious: (typically of an action or activity) wicked or criminal.';
     } else if (userInput.includes('ostracize')) {
         response = 'Ostracize: exclude (someone) from a society or group.';
     } else if (userInput.includes('prosaic')) {
         response = 'Prosaic: having the style or diction of prose; lacking poetic beauty.';
     } else if (userInput.includes('quixotic')) {
         response = 'Quixotic: exceedingly idealistic; unrealistic and impractical.';
     } else if (userInput.includes('recalcitrant')) {
         response = 'Recalcitrant: having an obstinately uncooperative attitude toward authority or discipline.';
     } else if (userInput.includes('sagacious')) {
         response = 'Sagacious: having or showing keen mental discernment and good judgment; wise or shrewd.';
     } else if (userInput.includes('taciturn')) {
         response = 'Taciturn: (of a person) reserved or uncommunicative in speech; saying little.';
     } else if (userInput.includes('ubiquitous')) {
         response = 'Ubiquitous: present, appearing, or found everywhere.';
    } else if (userInput.includes('show me 50 French words and their english word meaning')||(userInput.includes('show me any french wolds and their meaning'))) {
            const tableData = [
                ["Bonjour", "Hello"],
                ["Merci", "Thank you"],
                ["Oui", "Yes"],
                ["Non", "No"],
                ["S'il vous plaît", "Please"],
                ["Excusez-moi", "Excuse me"],
                ["Bien", "Good"],
                ["Mal", "Bad"],
                ["Maison", "House"],
                ["Amour", "Love"],
                ["Ami", "Friend"],
                ["Famille", "Family"],
                ["Jour", "Day"],
                ["Nuit", "Night"],
                ["Temps", "Time"],
                ["Voiture", "Car"],
                ["Livre", "Book"],
                ["Chanson", "Song"],
                ["Nourriture", "Food"],
                ["Eau", "Water"],
                ["Café", "Coffee"],
                ["Thé", "Tea"],
                ["Vivre", "To live"],
                ["Manger", "To eat"],
                ["Parler", "To speak"],
                ["Apprendre", "To learn"],
                ["École", "School"],
                ["Travail", "Work"],
                ["Ville", "City"],
                ["Pays", "Country"],
                ["Mer", "Sea"],
                ["Montagne", "Mountain"],
                ["Fête", "Party"],
                ["Soleil", "Sun"],
                ["Lune", "Moon"],
                ["Temps", "Weather"],
                ["Chien", "Dog"],
                ["Chat", "Cat"],
                ["Oiseau", "Bird"],
                ["Poisson", "Fish"],
                ["Fleur", "Flower"],
                ["Arbre", "Tree"],
                ["Jardin", "Garden"],
                ["Chaise", "Chair"],
                ["Table", "Table"],
                ["Porte", "Door"],
                ["Fenêtre", "Window"],
                ["Rue", "Street"],
                ["Clé", "Key"],
                ["Bateau", "Boat"],
                ["Avion", "Airplane"],
                ["Fleurs", "Flowers"],
                ["Mère", "Mother"],
                ["Père", "Father"],
                ["Frère", "Brother"],
                ["Sœur", "Sister"],
                ["Enfant", "Child"],
            ];
            addTable(tableData, 'bot');
            return;
        } else if (userInput.includes('show me 50 french words and their english word meaning')||(userInput.includes('show me fifty french words and their english word meaning'))||(userInput.includes('give me fifty french words and their meaning'))||(userInput.includes('show me any french words and en their meaning'))) {
            const tableData = [
                ["Bonjour", "Hello"],
                ["Merci", "Thank you"],
                ["Oui", "Yes"],
                ["Non", "No"],
                ["S'il vous plaît", "Please"],
                ["Excusez-moi", "Excuse me"],
                ["Bien", "Good"],
                ["Mal", "Bad"],
                ["Maison", "House"],
                ["Amour", "Love"],
                ["Ami", "Friend"],
                ["Famille", "Family"],
                ["Jour", "Day"],
                ["Nuit", "Night"],
                ["Temps", "Time"],
                ["Voiture", "Car"],
                ["Livre", "Book"],
                ["Chanson", "Song"],
                ["Nourriture", "Food"],
                ["Eau", "Water"],
                ["Café", "Coffee"],
                ["Thé", "Tea"],
                ["Vivre", "To live"],
                ["Manger", "To eat"],
                ["Parler", "To speak"],
                ["Apprendre", "To learn"],
                ["École", "School"],
                ["Travail", "Work"],
                ["Ville", "City"],
                ["Pays", "Country"],
                ["Mer", "Sea"],
                ["Montagne", "Mountain"],
                ["Fête", "Party"],
                ["Soleil", "Sun"],
                ["Lune", "Moon"],
                ["Temps", "Weather"],
                ["Chien", "Dog"],
                ["Chat", "Cat"],
                ["Oiseau", "Bird"],
                ["Poisson", "Fish"],
                ["Fleur", "Flower"],
                ["Arbre", "Tree"],
                ["Jardin", "Garden"],
                ["Chaise", "Chair"],
                ["Table", "Table"],
                ["Porte", "Door"],
                ["Fenêtre", "Window"],
                ["Rue", "Street"],
                ["Clé", "Key"],
                ["Bateau", "Boat"],
                ["Avion", "Airplane"],
                ["Fleurs", "Flowers"],
                ["Mère", "Mother"],
                ["Père", "Father"],
                ["Frère", "Brother"],
                ["Sœur", "Sister"],
                ["Enfant", "Child"],
            ];
            addTable(tableData, 'bot');
            return;
        } else if (userInput.includes('show all the elements with their symbols') ||(userInput.includes('show me all the elements with their symbols'))||(userInput.includes('give all elements with their symbols'))||(userInput.includes('show me elements with their symbols'))) {
            const tableData = [
                ['Element', 'Symbol', 'Atomic Number'],
                ['Hydrogen', 'H', '1'],
                ['Helium', 'He', '2'],
                ['Lithium', 'Li', '3'],
                ['Beryllium', 'Be', '4'],
                ['Boron', 'B', '5'],
                ['Carbon', 'C', '6'],
                ['Nitrogen', 'N', '7'],
                ['Oxygen', 'O', '8'],
                ['Fluorine', 'F', '9'],
                ['Neon', 'Ne', '10'],
                ['Sodium', 'Na', '11'],
                ['Magnesium', 'Mg', '12'],
                ['Aluminum', 'Al', '13'],
                ['Silicon', 'Si', '14'],
                ['Phosphorus', 'P', '15'],
                ['Sulfur', 'S', '16'],
                ['Chlorine', 'Cl', '17'],
                ['Argon', 'Ar', '18'],
                ['Potassium', 'K', '19'],
                ['Calcium', 'Ca', '20']
            ];
        addTable(tableData, 'bot');
        return;
    } else {
        // Default response if no match is found
        try {
            const result = math.evaluate(userInput); // Using math.js for evaluation
            response = `The answer is (${result})`;
        } catch (error) {
            response = "Sorry, I couldn't get the problem or question response because I am a small Integrated AI. Please can you ask something else or you will rephrase.";
        }
    }

    setTimeout(() => addMessageToChat('bot', response), 1000); // Add delay for typing effect

};