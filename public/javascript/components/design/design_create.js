class Write extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            file: null
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
    }
    // React에선 css 이런 방식으로도 사용가능
    render(){
        var design_form = {
            width: '970px',
            margin: '0 auto',
            overflow: 'auto'
        }
        var profile_image = {
            backgroundColor : '#F6F6F6',
            border: '1px solid black', 
            width: '202px',
            height: '270px',
            float: 'left',
            margin: '40px 20px 20px 20px',
            textAlign:'center',
            fontWeight: '800'                         
        }
        var image = {
            width: '198px',
            height: '230px',

        }
        var design_information = {
            float: 'left',
            margin: '20px',
            fontFamily: 'Sunflower',
            fontSize: '10px',
        }

        var file_input = {
            display: 'none'
        }

        var row = {
            fontWeight: 800,
            paddingRight: '25px',

        }
        var input_title = {
            width: '570px',
            height: '30px',
            fontSize: '10px',
            paddingLeft: '9px'
        }
        var input_money = {
            width: '130px',
            height: '30px',
            fontSize: '10px',
            paddingLeft: '9px'

        }
        var td_money = {
            fontWeight: 800,
            textAlign: 'left',
            fontSize: '12px'

        }
        var td_warning = {
            fontWeight: 800,
            fontSize: '11px'
        }
       
        var table = {
            borderCollapse: 'separate',
            borderSpacing: '0 20px'
        }
        var textarea = {
            width: '578px',
            height: '107px',
            padding: '10px',
            marginTop: '10px'

        }
        var design_explanation = {
            fontWeight: 800,
            verticalAlign: 'top'
        }
        var btn_style = {     
            clear: 'both',
            float: 'center',
            width: '240px',
            margin: '0 auto',
            padding: '0',
            color: '#ffffff',
            border: '0'
        }
        var btn_cancel = {
            fontWeight: 800,
            backgroundColor: '#BDBDBD',
            width: '90px',
            height: '42px',
            padding: '1px 6px',
            color: '#ffffff',
            float: 'left',
            border: '0px',
            borderRadius: '12px',
            display: 'table',                  
        }
        var btn_cancel_link = {
            display: 'table-cell',
            textAlign: 'center',
            verticalAlign: 'middle',
            color: '#ffffff'
        }
        var btn_submit = {
            fontWeight: 800,
            backgroundColor: '#F15F5F',
            width: '90px',
            height: '42px',
            padding: '1px 6px',
            color: '#ffffff',
            float: 'right',
            border: '0px',
            borderRadius: '12px'
        }
        var tag = {
            margin:'0px',
            padding: '1px'
            
        }
        var file_text = {
            marginTop: '5px'
        }
        
        return(
            <form method="post" action="/design/design_create" encType="multipart/form-data">
            
            <div style={design_form}>
           
                <div id="profile_image" style={profile_image}>
                <label htmlFor = "image" style={file_text}>파일 올리기</label>
                 <input type="file" id="image" onChange={this.handleChange} name="image" style={file_input}></input>
                    <img class="ProjectIntroduction__ProjectCover" style={image} src={this.state.file}/>
                </div>
                <div id="design_information" style={design_information}>
                
                    <table style={table}>
                        <tr>
                            <td  style ={row}>작품제목</td>
                            <td colSpan="6"><input type="text" style={input_title} name="title" placeholder="제목을 입력해주세요."/></td>
                            
                        </tr>
                        <tr>
                            <td  style ={row}>예상가</td>
                            <td colSpan="5" style={td_money} ><input type="text" style={input_money} name="prediction_price" placeholder="금액을 입력해주세요."/> &nbsp; 원</td>
                            
                            
                        </tr>
                        <tr>
                            <td colSpan="6" style={td_warning}>※ 판매자격이 주어지는 경우 예상가의 10%만 인상가능합니다.</td>
                            
                            
                        </tr>
                        <tr>
                            <td style ={row}>종류</td>
                            <td> <input type="radio" name="kinds" value="Earring"/>귀걸이</td>
                            <td><input type="radio" name="kinds" value=" Piercing"/>피어싱 </td>
                            <td><input type="radio" name="kinds" value="Ring"/>반지</td>
                            <td><input type="radio" name="kinds" value="Wristband"/>팔찌 </td>
                        </tr>
                        <tr>
                            <td style ={tag}></td>
                            <td><input type="radio" name="kinds" value="Necklace"/>목걸이 </td>
                            <td><input type="radio" name="kinds" value="Choker"/>초커 </td>
                            <td><input type="radio" name="kinds" value="Clock"/>시계 </td>
                            <td><input type="radio" name="kinds" value="Brooch"/>브로치 </td>
                            <td><input type="radio" name="kinds" value="Hairclip"/>머리핀 </td>
                        </tr>
                        
                        <tr>
                            <td  style ={row} >태그</td>
                            <td> <input type="checkbox" name="tag[]" value="봄"/>봄</td>
                            <td> <input type="checkbox" name="tag[]" value="여름"/>여름</td>
                            <td> <input type="checkbox" name="tag[]" value="가을"/>가을</td>
                            <td> <input type="checkbox" name="tag[]" value="겨울"/>겨울</td>
                            
                        </tr>
                        <tr>
                            <td style ={tag}></td>
                            <td> <input type="checkbox" name="tag[]" value="큐트"/>큐트</td>
                            <td> <input type="checkbox" name="tag[]" value="화려"/>화려</td>
                            <td> <input type="checkbox" name="tag[]" value="우아"/>우아</td>
                            <td> <input type="checkbox" name="tag[]" value="심플" />심플</td>
                        </tr>
                       
                        <tr>
                            <td style ={row, design_explanation}> 작품설명</td>
                            <td colSpan="5" rowSpan="5"><textarea style={textarea} name="contents"></textarea></td>
                            
                        </tr>
                    </table>
                

                </div>  
                <div style={btn_style}>
                    <div style={btn_cancel}><a style={btn_cancel_link} href="/design"> 취소 </a></div>
                    <input style={btn_submit} type="submit" value="등록"/>
                </div>
            </div>
            </form>
        );
    }
}


function Design_create() {
    return(
        <div className="App">
            
            <Write></Write>
           
        </div>
    );
  
}
ReactDOM.render(<Design_create />, document.getElementById('design_create_container'));

 // React.createElement(component, props, ...children)
//ReactDOM.render(element, container[, callback]) 