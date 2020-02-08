var headerPoint = document.getElementById('userPoint');
class List extends React.Component{
    constructor(props) {
        super(props);
        var text = "";
        if(parseInt(purchase) == 0)
            text = "후원하기";
        else
            text = "후원 취소";

        var endDate = Date.parse(posts[0].endDate);
        var nowDate = new Date();
    
        var btMs = endDate - nowDate.getTime();
        var btDay = parseInt(btMs / (1000*60*60*24)) + 1;

        var tagList = [];

        for(var x=0; x < posts[0].tag.length; x++){
            var tag=posts[0].tag[x]
            var tag_code = 'projectItem_tagt';
            if(tag=="봄"){
                tag_code+=" tag_spring";
            }else if(tag=="여름"){
                tag_code+=" tag_summer";
            }else if(tag=="가을"){
                tag_code+=" tag_fall";
            }else if(tag=="겨울"){
                tag_code+=" tag_winter";
            }else if(tag=="큐트"){
                tag_code+=" tag_cute";
            }else if(tag=="화려"){
                tag_code+=" tag_brilliant";
            }else if(tag=="우아"){
                tag_code+=" tag_luxury";
            }else if(tag=="심플"){
                tag_code+=" tag_simple";
            }
            tagList.push(<div className ={tag_code} >{posts[0].tag[x]}</div>);
        }

        this.state = {
          purchaseCount: posts[0].sponsor.length,
          purchase: parseInt(purchase),
          text: text,
          btDay: btDay,
          tagList: tagList,
        };
        this.signIn = this.signIn.bind(this);
        this.purchaseButton = this.purchaseButton.bind(this);
    }

    signIn(){
        axios.post('/purchase/like', {
            post: posts[0]._id
          })
          .then((response) => {
            if(response.data.success == true){
                if(this.state.purchase == 0){
                    this.setState({purchaseCount: response.data.purchaseCount, purchase: 1, text: "후원 취소"});
                    headerPoint.innerHTML  = response.data.point;
                    console.log(this.state);
                }else{
                    this.setState({purchaseCount: response.data.purchaseCount, purchase: 0, text: "후원하기"});
                    headerPoint.innerHTML  = response.data.point;
                    console.log(this.state);
                }
            }else if(response.data.reason == 'point'){
                alert('포인트가 부족합니다.');
            }
          })
          .catch((error) => {
            console.log(error);
          });            
    }
  
    purchaseButton = () => {

        let itemList = [];
        var writer = posts[0].writer.userid;
        var visitor = session.loginInfo.userid;
        if(writer == visitor){
           
            itemList.push(
                <div>
                <form method="post" action="/purchase/modify">
                <input type="hidden" name="purchaseId" value={posts[0]._id}></input><button className="Button-sc-1x93b2b-0 KCBYB" onClick={this.modifyIn}>수정하기</button>
                </form>
                </div>
            );
            itemList.push(
                <div>
                <form method="post" action="/purchase/delete">
                <input type="hidden" name="purchaseId" value={posts[0]._id}></input><button className="Button-sc-1x93b2b-0 KCBYB" onClick={this.modifyIn}>삭제하기</button>
                </form>
                </div>
            );
        }
        else{
            itemList.push(
                <button className="Button-sc-1x93b2b-0 KCBYB" onClick={this.signIn} >
                    {this.state.text}
                </button>    
                );
        }

        
        return itemList;
    }
   
    


    render(){
       
        return(           
            <div className="ProjectIntroduction_ProjectIntroductionBackground">
                <div className="Container">
                    <div className="ProjectIntroduction_ProjectIntroductionWrapper">
                        <div className="ProjectIntroduction_ProjectOutline">
                            <div className="ProjectIntroduction__ProjectOutlineInner-sc-1o2ojgb-3 fFIyMZ">
                                <span className="ProjectIntroduction__ProjectCategory">{posts[0].kinds}</span>
                                <h1 className="ProjectIntroduction__ProjectTitle">{posts[0].title}</h1>
                                <div className="ProjectIntroduction__Creators">
                                    <span className="ProfileImg"></span>
                                    <a className="ProjectIntroduction__CreatorName"
                                    href="https://tumblbug.com/u/dasedewadizokato/projects" target="_blank"
                                    rel="noopener noreferrer">{posts[0].writer.userid}</a>
                                </div>
                                <div>{this.state.tagList}</div>
                            </div>
                        </div>
                    </div>
                    <div className='ProjectIntroduction__ProjectIntroductionMain'>
                        <div className="ProjectIntroduction__ProjectIntroductionMainColumn">
                            <img className="ProjectIntroduction__ProjectCover" alt="기본 프로젝트 커버 이미지" src={posts[0].image} width="400px" height="600px"/>
                        </div>
                        <div className="ProjectIntroduction__FundingStatuss_f">
                            <div className="ProjectIntroduction__Metric">
                                <div className="ProjectIntroduction__StatusTitle">판매 금액</div>
                                <div className="ProjectIntroduction__StatusValue">
                                    <span className="ProjectIntroduction__Small">{posts[0].price}</span>&nbsp;<span className="ProjectIntroduction__FundingRate">원</span>
                                </div>
                            </div>
                            <div className="ProjectIntroduction__Metric">
                                <div className="ProjectIntroduction__StatusTitle">남은 시간</div>
                                <div className="ProjectIntroduction__StatusValue">
                                    <span className="ProjectIntroduction__Small">{this.state.btDay}</span>&nbsp;<span className="ProjectIntroduction__FundingRate">일</span>
                                </div>
                            </div>

                            <div className="ProjectIntroduction__Metric">
                                <div className="ProjectIntroduction__StatusTitle">후원자</div>
                                <div className="ProjectIntroduction__StatusValue">
                                    <span className="ProjectIntroduction__Small">{this.state.purchaseCount}</span>&nbsp;<span className="ProjectIntroduction__FundingRate">명</span>
                                </div><br/>
                                <div className="FundingInformation">
                                    <div className="FundingInformation__FundingInformationInner">
                                        <div>펀딩 진행중</div><br/>
                                        <span>
                                            목표 인원인 {posts[0].goal}명이 모여야만 펀딩이 진행됩니다.<br/>
                                            펀딩 실패시 결제금액은 다시 환불됩니다.
                                        </span>
                                    </div>
                                </div>
                                <div className="ProjectIntroduction__ProjectButtons-sc-1o2ojgb-19 fHOYOE">
                                <div className="ProjectIntroduction__ProjectButtonsInner-sc-1o2ojgb-20 frPGIq">
                                    <div className="ProjectIntroduction__PrimaryButton-sc-1o2ojgb-21 lcgtza">
                                         {this.purchaseButton()}
                                    </div>
                                    <div className="ProjectIntroduction__SecondaryButton-sc-1o2ojgb-22 cbkMWz">
                                        <button className="Button-sc-1x93b2b-0 fVHsGg"><i className="_1QY7TzdLHKX3-BKPDNNYKF"></i>
                                            <svg width="20px" height="22px" viewBox="0 0 20 22" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <title>ic_share_B</title>
                                                <g id="PC" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <g id="Asset" transform="translate(-152.000000, -414.000000)">
                                                        <g id="btn_share-copy-2" transform="translate(131.000000, 399.000000)">
                                                            <g id="ic_share_B" transform="translate(19.000000, 14.000000)">
                                                                <g id="ic_share">
                                                                    <rect id="Rectangle-Copy-9" fill-rule="nonzero" x="0" y="0"
                                                                        width="24" height="24"></rect>
                                                                    <g id="share-2" transform="translate(3.000000, 2.000000)"
                                                                    stroke="#5C5C5C" stroke-linecap="round"
                                                                    stroke-linejoin="round" stroke-width="2">
                                                                        <circle id="Oval" cx="15" cy="3" r="3"></circle>
                                                                        <circle id="Oval" cx="3" cy="10" r="3"></circle>
                                                                        <circle id="Oval" cx="15" cy="17" r="3"></circle>
                                                                        <path d="M5.59,11.51 L12.42,15.49" id="Path"></path>
                                                                        <path d="M12.41,4.51 L5.59,8.49" id="Path"></path>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function updateState(text){
    console.log(typeof text.comments);
    console.log(text.comments);
    for(var i = 0; i < text.comments.length; i++){
        text.comments[i].modify = false;
    }
    this.setState(text);
}

class CommentList extends React.Component{
    constructor(props) {
        super(props);

        posts[0].comments.forEach(element => {
            element.modify = false;
        });

        this.state = {
            comments: posts[0].comments
        };   
        
        this.comment = this.comment.bind(this);
        this.comment1 = this.comment1.bind(this);
        updateState = updateState.bind(this)
        this.modifyComment = this.modifyComment.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    comment1(commentId){
        axios.post('/purchase/deleteComment', {
            designId: posts[0]._id,
            commentId: commentId
        }).then((response) => {
            console.log(response);
            for(var i = 0; i < response.data.designObj[0].comments.length; i++){
                response.data.designObj[0].comments[i].modify = false;
            }
            this.setState({
                comments: response.data.designObj[0].comments
            });
        }).catch((error) => {
        });
    };

    modifyComment=(commentId, index, type)=>{
        if(type == 1){
            var allcomments = this.state.comments;
            allcomments[index].modify = true;
            this.setState({comments:allcomments});
            console.log(this.state);
        }else{
            axios.post('/purchase/modifyComment', {
                content: this.state.comments[index].content,
                designId: posts[0]._id,
                commentId: commentId
            }).then((response) => {
                console.log(response);
                for(var i = 0; i < response.data.designObj[0].comments.length; i++){
                    response.data.designObj[0].comments[i].modify = false;
                }
                this.setState({
                    comments: response.data.designObj[0].comments
                });
            }).catch((error) => {
            });
        }
    }

    handleChange(event, index) {
        var allcomments = this.state.comments;
        allcomments[index].content = event.target.value;
        this.setState({comments:allcomments});
        console.log(index);
        console.log(this.state.comments[index].content);
    }

    comment  = () => {
        
        
        let commentList = [];

        console.log(this.state);
        
        this.state.comments.forEach((comment, index) => {
            
            var visitor = session.loginInfo.userid;
            var writer = comment.writer.userid;
            var commentdate = comment.createdAt.toString().replace(/T/, ' ').replace(/\..+/, '');
            var comments = this.state.comments;
            
            if(visitor == writer){

                var modifyButton;
                var modifyArea = []

                if(comment.modify == false){
                    modifyButton = <div className="commentButton1"><img onClick={() => this.modifyComment(comment._id, index, 1)} className="commentImg" src="/public/images/design_purchase/pencil.png"/><button className="commentButton2" onClick= {() => this.comment1(comment._id)}><img className="commentImg" src="/public/images/design_purchase/cancel.png"/></button></div>
                    comment.content.split('\n').map( line => {
                        modifyArea.push(<span>{line}<br/></span>);
                    }); 
                }else{
                    modifyButton = <div className="commentButton1"><img onClick={() => this.modifyComment(comment._id, index, 2)} className="commentImg" src="/public/images/design_purchase/pencil.png"/></div>
                    modifyArea.push(<textarea className="textareaComment" name="comment" value={comment.content} onChange={(event)=>this.handleChange(event, index)}/>);
                }


                commentList.push(
                    <div>
                        <div className="commentWriter">
                            <span>{comment.writer.userid}</span>
                            <span className="commentModify">
                                {modifyButton}
                            </span>
                        </div>
                        <div className="commentContent">
                            {modifyArea}
                            <div>{commentdate}</div>
                        </div>
                    </div>

                );
            }else{
                commentList.push(
                    <div>
                        <div className="commentWriter">{comment.writer.userid}</div>
                        <div className="commentContent">
                            {comment.content.split('\n').map( line => {
                                return (<span>{line}<br/></span>)
                            })}
                            <div>{commentdate}</div>
                        </div>
                    </div>
                );
            }
        });
        return commentList;

        
    };

    render() {
        return (
            <div className="comment">
                <div className="allComment">전체 댓글</div>
                {this.comment()}
            </div>
        );
    }
}

class Contents extends React.Component{    
       
    constructor(props) {
        super(props);
        this.state = {
            content: true,
            community: false,
            commentContent: ''
        };
        this.onClickContent = this.onClickContent.bind(this);
        this.onClickCoummunity = this.onClickCoummunity.bind(this);
        this.createComment = this.createComment.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    updateChild(text) {
        updateState(text)
    }
    
    onClickContent() {
        this.setState(() => ({ content: true, community: false }));
    }
    onClickCoummunity() {
        this.setState(() => ({ content: false, community: true }));
    }
    
    createComment(){
        axios.post('/purchase/createComment', {
            designId: posts[0]._id,
            comment: this.state.commentContent
        }).then((response) => {
            console.log(response);
            this.updateChild({comments: response.data.designObj[0].comments});
            this.setState({commentContent:''});
        }).catch((error) => {
            console.log(error);
        });            
    }

    handleChange(event) {
        this.setState({commentContent: event.target.value});
    }

    render() {
        return (
            <div className="project_contents">
            
                <div className="project_contentTitle">
                    <button className={this.state.content? "selected" : ""} onClick={this.onClickContent}>상품 내용</button>
                    <button className={this.state.community? "selected" : ""} onClick={this.onClickCoummunity} >커뮤니티</button>

               
        {this.state.content && <div className="project_content"  >{posts[0].contents}</div>}
            </div>
            {this.state.community &&<div className="project_Comment">
                   <div className="inputComment"><textarea className="textareaComment" name="comment" value={this.state.commentContent} onChange={this.handleChange}/>
                   <div className="uploadComment"><button type="submit" className="submitComment" onClick={this.createComment}>입력</button></div> </div>
                <CommentList></CommentList>
            </div>}
            </div>
        );
    }
}


function Design_list() {
    return(
        <div classNameName="App">
            <List></List>
            <Contents></Contents>
        </div>
    );
}
ReactDOM.render(<Design_list />, document.getElementById('design_list_container'));

 // React.createElement(component, props, ...children)
//ReactDOM.render(element, container[, callback]) 