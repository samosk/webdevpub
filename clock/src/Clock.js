export class Clock{
    
    constructor(hour, minute){
        (hour >= 0 && hour < 24) ? this._hour = hour : console.log("Fuckery at hourmark, value must be between 0 and 24");
        (minute >= 0 && minute < 60) ? this._minute = minute : console.log("Fuckery at minutemark, value must be between 0 and 60");
        this.alarmIsActive = true;
        this.alarmIsTrigger = false;
        this.setAlarm(14, 0);
    }
  
    setAlarm(hour, minute){
        this._hourAlarm = hour;
        this._minuteAlarm = minute;
    }
    set setAlarmFromString(string){
        this._hourAlarm = string.split(":")[0] //takes the first value of the total time value, 13:56, takes "13"
        this._minuteAlarm = string.split(":")[1] //takes the second value of the total time value, 13:56, takes "56"
        this.alarmIsTrigger = false;
        
    }
    get setAlarmFromString(){
        return this.alarmTime;
    }
    activateAlarm(){
        this.alarmIsActive = true;
    }

    deactivateAlarm(){
        this.alarmIsActive = false;
    }

    toggleAlarm(){
        this.alarmIsTrigger = false;
    }

    get time(){
        return {"hour": this._hour.toString().padStart(2, '0'),
        "minute": this._minute.toString().padStart(2, '0')
        }
    }

    get alarmTime(){
        return this._hourAlarm.toString().padStart(2, '0') + ':' + this._minuteAlarm.toString().padStart(2, '0');
    }

    tick(){
        this._minute += 1;

        if(this._minute >= 60){
            this._minute = 0;
            this._hour += 1;
        }

        if(this._hour >= 24){
            this._hour = 0;
        }

        let hourPrefix = (this._hour < 10) ? "0"+this._hour : this._hour;
        let minutePrefix = (this._minute < 10) ? "0"+this._minute : this._minute;
        console.log(hourPrefix + ":" + minutePrefix) //writes time without fuckery;

        if(this.alarmIsActive && this._hour == this._hourAlarm && this._minute == this._minuteAlarm){
            console.log("Alarm!!!");
            this.alarmIsTrigger = true;
        }
    }
    

}




