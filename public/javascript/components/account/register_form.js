class Register extends React.Component {
    constructor(props) {
        super(props);
        //state  값 값을 초기화
        this.state = {
            date: new Date()
        };
    }
    onDateChange = date => { 
        this.setState({
          date: moment(date).format("YYYY-MM-DD")
        })  
      };
    render() {
        return (
            
            <form method="post" action="/account/register">
                <div className="register_content">
                    <input type="text" name="userid" required placeholder="ID" /><br />
                    <input type="password" name="password" required placeholder="Password" /><br />
                    <input type="text" name="username" required placeholder="Name" /><br />
                    <input type="email" name="email" required placeholder="Email" /><br />
                    <input type="text" name="address" required placeholder="Address" /><br />
                    <input type="tel" name="phone" required placeholder="Phone" /><br />
                    <input type="date" onChange={this.onDateChange} name="birth" required placeholder={this.state.date} /> <br/>

                    <input type="submit" value="가입하기" className="btn1" />
                    <input type="reset" value="취소" className="btn1" />
                </div>
            </form>
        )
    }
}
ReactDOM.render(<Register />, document.getElementById('register_form'));