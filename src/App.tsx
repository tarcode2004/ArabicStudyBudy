import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [firstCall, setFirstCall] = useState<boolean>(true);
    const [generatedSentence, setGeneratedSentence] = useState<{arabic: string, english: string}>({ arabic: '', english: ''}); 
    const synth = window.speechSynthesis;
    const string = "father,أب;to believe in,آمن ب;it appears, seems that,يبدو ان;until; in order to,حتى;party,حفلة;neighborhood,حي;to invite,دعا;invitation (card),بطاقة دعوة;trip, flight,رحلة;meal eaten before dawn during Ramadan,السحور;TV series,مسلسل;sky, heavens,السماء;to supervise,أشرف على;to fast,صام;wedding,عرس;capital,عاصمة;I believe that,أعتقد أن;institute,معهد;happiness,فرح;happy occasion,أَفراح;to do (something),فعل;holy,مقدس;nervousness, anxiety,قلق;to get up,قام;enough,كاف;star,نجم;to put, place (something),وضع;rest, remainder of,بقية;to meet, gather (with),اجتمع ب/مع;meeting,اجتماع;to bring,جاء ب;location, place,محل;local,محلّيّ;to have a disagreement, dispute with,اختلف مع;to differ from,اختلف عن;oriental, Middle Eastern,شرقي;to be/become (pre)occupied with,انشغل ب;to watch,شاهد;cook, chef,طباخ;flavor,طعم;to get used to, accustomed to,اعتاد على;to break one's fast, especially in Ramadan: to have breakfast,افطر;cafe,مقهى;boredom,الملل;meal,وجبة;to undertake, assume (a task or position),تولى;at all,أبداً;certain, sure (of/that),مُتَأَكِّد من/أنّ;mail, post,بريد;belly, stomach,بطن;heavy,ثقيل;part of,جزء;body,جسم;to try to, attempt,حاول;drugs,مخدرات;light,خفيف;morals,أخلاق;to be afraid for (someone),خاف على;to be afraid of,خاف من;afraid,خائف;blood,دم;without,بدون;smart, intelligent,ذكي;perhaps, maybe,ربما;time, times (abstract),زمن;hair,شعر;upset, bothered (by),متضايق;to consider (someone or something) to be,اعتبر;to leave (a place),غادر;heart,قلب;to hint (to someone) that,لمح (الى) ان;to discuss (something),ناقش;to discuss with (someone),تناقش مع;important,مهم;most/more important,أهم;to trust, have confidence in,وثق;trust, confidence,ثقة;trusting, confident in,واثق;face,وجه;hand,يد;polite, well-mannered,مُؤَدَّب;outside,خارج;especially since,خصوصاً وأنّ;different from,مختلف عن;head,رأس;leg,رجل;to welcome,رحب ب;to focus, concentrate on,ركز على;youth (stage of life),الشباب;to occupy, preoccupy,شغل;to praise (a person),شُكراً;form, shape, you look...,شكل;friendship,صداقة;(he) has always...,طوال;to get (someone) accustomed to,عود (على) ان;to open,فتح;superior,متفوق;thousand,الف;environment,بيئة;passport,جواز سفر;to respect,اِحتَرَمَ;to carry,حمل;to need,احتاج الى;a need,حاجة;in need of,بحاجة الى;to push, to pay,دفع;motive,دافع;the world, this world,الدنيا;behavior,سلوك;to act, behave,تصرف;action,تصرف;necessary,ضروري;injustice,ظلم;to give,أعطى;rich,غني;pride,فخر;proud of,فخور;poor,فقير;to mean, intend,قصد;dignity,كرامة;to grow up; arise,نشا;(piece of advise),نصيحة;gift, present,هدية;homeland,وطن;citizen,مواطن;to stop,توقف;"
    const array = string.split(";");


    useEffect(() => {
        const key = localStorage.getItem('openai_api_key');
        if (key) {
            setApiKey(key);
        } else {
            alert("Please store your API key in local storage with the key 'openai_api_key'.");
        }
    }, []);

    useEffect(() => {
      if (playing) {
          generateAndSpeak();
      }
      // Cleanup function to stop the speech when component unmounts or playing stops
      return () => {
          if (synth.speaking) {
              synth.cancel();
          }
      };
    }, [playing]);

    const play = async() => {
      await setPlaying(true);
      console.log(playing);
    }

    const stop = async () => {
      await setPlaying(false);
      await setFirstCall(true);
      console.log(playing);
    }

    const generateAndSpeak = async () => {
      while (playing === true) {
      if (!apiKey) return;
  
      let promptText = firstCall?
       `Generate a sentence in arabic using the following words, you may use other arabic words. They should be sentences someone would use in daily life. Only return an arabic sentence and english translation. Don't say anything else. It should be in the follwing format: {"arabic": "", "english": ""} with the following words ${array[Math.floor(Math.random() * array.length)]} and ${array[Math.floor(Math.random() * array.length)]}.` :
       `Generate another in the same format without any comentary with the words ${array[Math.floor(Math.random() * array.length)]} and ${array[Math.floor(Math.random() * array.length)]}.`
  
      let response;
      try {
          response = await axios.post('https://api.openai.com/v1/chat/completions', {
              model: "gpt-3.5-turbo",
              messages: [
                  {
                      role: "system",
                      content: "You are a helpful assistant."
                  },
                  {
                      role: "user",
                      content: promptText
                  }
              ],
          }, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`
              }
          });
        }
        catch (error) {
          console.error('Error:', error);
          promptText = `Regenerate in the follwing format, do not make any comentary: {"arabic": "", "english": ""}`
          try {
            response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: promptText
                    }
                ],
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });
          }
          catch (error) {
            console.error('Error:', error);
            return;
          }
        }
  
      const data = response.data;
      console.log(data.choices[0].message.content);
      // Assuming the response format fits the expected JSON structure you provided.
      // You may need to adjust the parsing logic based on the actual response format.
      const { arabic, english } = JSON.parse(data.choices[0].message.content);
      setGeneratedSentence({ arabic, english });
      await speakText(arabic, 'ar');
      await speakText(english, 'en');

      // After the first call, set firstCall to false
      if (firstCall) setFirstCall(false);
      await waitThreeSeconds(5);
      }
  }; //End of generateAndSpeak

  const speakText = (text: string, lang: string) => {
    if (playing === false) return;
    return new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onend = () => resolve();
        speechSynthesis.speak(utterance);
    });

  };

  // Style for the buttons, to keep consistency and avoid repetition
  const buttonStyle = {
    marginRight: '10px', // Space between buttons
    padding: '10px 20px', // Padding inside the buttons
    border: 'none', // Remove default border
    borderRadius: '5px', // Curved corners for buttons
    cursor: 'pointer', // Change cursor to pointer on hover
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Optional: adds a subtle shadow
  };

  return (
    <div style={{
      backgroundColor: 'lightgreen', // Set the background color to light green
      height: '100vh', // Set the height to fill the screen
      width: '100vw', // Set the height to fill the screen
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // Center content vertically
      alignItems: 'center', // Center content horizontally
    }}>
      <div style={{
        marginBottom: '20px', // Space between the text and buttons
        padding: '10px', // Padding inside the white boxes
        backgroundColor: 'white', // Background color for the text
        minWidth: '50vh',
        borderRadius: '10px', // Curved corners
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Optional: adds a subtle shadow
      }}>
        <p>Current Arabic: </p>
        <p style={{ fontSize: '30px' }}>{generatedSentence.arabic}</p>
        <p>Current English: </p>
        <p>{generatedSentence.english}</p>
      </div>
      <div>
        <button id="playButton" onClick={() => play()} style={buttonStyle}>Play</button>
        <button id="pauseButton" onClick={() => stop()} style={buttonStyle}>Pause</button>
      </div>
    </div>
  );

};

export default App;

function waitThreeSeconds(time: number = 3000): Promise<void>{
  return new Promise(resolve => {
    setTimeout(() => {
        console.log(`${time} time seconds have passed!`); 
        resolve();
      }, time*1000); // Timeout in milliseconds
  });
}

