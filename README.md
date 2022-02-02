# layerCake.js


## 설계 방향

### 벤치마킹
- CakePHP
  - 이전 회사에서 주력으로 쓰던 프레임워크입니다. PHP버전 Ruby On Rails를 표방하고 있습니다.
  - 리퀘스트가 미들웨어를 순환하는 구조를 참고했습니다. 
  - 디렉토리 구조가 매우 체계적으로 쪼개져 있는데, 
  프로젝트가 뚱뚱해지면 디렉토리를 찾아가는 데에서 생산성이 떨어지는 단점을 느껴 해당 부분을 반면교사 삼았습니다. 
  - 이외에도 주력으로 사용하던 프레임워크라 여러 방향으로 영향을 끼친 부분이 있을 것이라고 생각합니다.
- Nest.js
  - 기능별로 쪼개져 있는 부분을 참고했습니다.

### 방향
- 아래 항목들에 대해서 확장이 유연하도록 목표하였습니다.
  - 미들웨어 및 추가 기능 플러그인
  - MVC 등에 필요한 컴포넌트 
- 디렉토리 접근에 대해서: M/V/C 별도로 접근하는 것 보다, 리소스 별도로 접근하는 것을 목표하였습니다.
  - **하나의 기능에 대하여 작업 할 때 최소 하나의 디렉토리에만 접근하여 작업할 수 있도록**하기를 원했습니다.
  - 이로 인해 머릿속에 그리기 쉬운 계층 구조 만들기를 원했습니다.

### 디렉토리 구조
#### 최종 구조
- cnfigs
  - appConfig.js
  - dbConfig.js
- src
  - resources
    - AppController.js
    - AppEntity.js
    - AppTable.js
    - index
      - indexController.js
    - students(example)
      - studentsController.js
      - studentsFromConturyController.js
      - studentsTable.js
      - studentsEntity.js
  - components
  - expressSetter
  - ApplicationGenerator.js
- bin 
  - www


## 구현 방법/과정

### 프로그램 구조

1. npm start를 실행하면 bin/www를 실행합니다.
2. bin/www 는 ./src/ApplicationGenerator를 작동하여 잘 세팅된 express()를 뽑아내어 생성해 서비스를 시작합니다.
3. ApplicationGenerator에서는 개발자가 express의 전체적인 미들웨어, 세팅, 리소스의 라우팅을 세팅할 수 있습니다. 
  세팅된 정보들은 /src/expressSetter/AppSetter를 불러와서 AppSetter가 세팅합니다.
    - 세팅: ./configs/appConfig.js 를 가져와서 express().set() 에 적용합니다.
    - 미들웨어 : 라우팅이 완료된 이전과 이후의 미들웨어, 마지막 미들웨어를 세팅할 수 있습니다.
    - 라우팅 : 각 리소스 Controller에 자동으로 적용될 경로 외의 경로를 적용할 수도 있습니다.
4. AppSetter는 express()를 생성하고, 각 리소스의 Controller에서 잘 세팅한 express.Router()를 가져와서 적용합니다.
   - ./configs/appConfig.js 에서 자동으로 모든 리소스를 세팅할지, 일부만 선택하여 세팅하는지 설정된 정보를 가져와서 적용합니다.
   - config의 정보를 토대로 서버의 디렉토리 목록을 읽어 각 리소스의 Controller 파일을 가져옵니다.
   - 같은 프로그램으로 여러 개의 서버를 띄워서 각 다른 서버에서 일부의 리소스 라우팅만 열 수도 있겠다고 생각했습니다.
   - 이에 따라 설정파일 수정만으로 간편하게 적용하는 방식을 원했습니다.
   - AppSetter 작동 순서입니다.
     1. AppSetter.set() 으로 appConfig의 정보를 주면, AppSetter가 가지고 있던 express()에 설정이 세팅됩니다.
     2. AppSetter.applicaion의 getter로 다음 과정으로 세팅된 express()를 가져올 수 있습니다. 
        1. ApplicationGenerator에서 라우팅되기 전에 사용하겠다고 세팅한 미들웨어를 적용합니다.
        2. appConfig에서 사용하겠다고 설정된 각 리소스들의 Controller 파일을 불러 설정된 express.Router()들을 각 리소스 경로에 적용합니다.
        3. ApplicationGenerator에서 라우팅 이후에 사용하겠다고 세팅한 미들웨어를 적용합니다.
        4. 에러 없이 과정이 완료되면 404 미들웨어를 주입합니다.
        5. 과정중에 에러가 있다면 500에러 미들웨어를 주입합니다.
        6. ApplicationGenerator에서 마지막으로 사용하겠다고 세팅한 미들웨어를 주입합니다. 보통 에러 캐쳐에 사용할 생각이었습니다.
        7. AppSetter가 가지고 있던 express()를 초기화하고 세팅된 express()를 내보냅니다.
5. 위 작동순서의 2.2의 리소스의 컨트롤러들은 ./src/resources의 각 디렉토리에 배치됩니다.
   - appConfig의 all_resources 설정이 true라면, 각 디렉토리의 모든 '*Controller.js' 파일들을 적용합니다.
   - appConfig의 all_resources 설정이 false라면 resources 설정에 들어있는 이름을 기준으로 불러올 디렉토리를 결정합니다.
   - 각 리소스 Controller의 역할은 다음과 같습니다.
     1. constructor()에서 this.routes에 **적용할 서비스들을 목차 작성하듯이 한눈에 서비스 로직이 잘 보이도록 작성**합니다.
      예시.
      ```js
          this.routes = {
            "*": {
              get: this.title
            },
            "/": {
              get: [this.categoriesAll, this.all, this.index],
              post: [this.create],
            },
            "/:id": {
              get: [this.view],
              post: [this.delete, this.update],
              put: [this.delete, this.update],
              patch: [this.delete, this.update],
              delete: [this.delete],
            },
            "/:id/publish": {
              post: [this.publish],
              put: [this.publish],
              patch: [this.publish],
            },
            "/form": {
              get: [this.instructorsAll, this.categoriesAll, this.fields],
            },
            "/form/:id": {
              get: [this.instructorsAll, this.categoriesAll, this.view, this.fields],
            },
          };
      ```
      이렇게 작성된 내용은 리소스의 Controller의 express.Router()에 적용됩니다.
     2. 각 리소스의 *Table.js에 작성된 비즈니스 로직을 적절히 사용하여 서비스를 작성합니다.
6. ./src/resources/AppController에서는 모든 리소스에 공통으로 적용할 내용을 작성합니다.
   - ApplicationGenerator에서 설정한 미들웨어 말고도, AppController에서 각 리소스의 라우터에 공통적으로 적용할 미들웨어를 설정합니다.
     - 여기서 설정된 미들웨어는 각 리소스의 Controller에서 적당히 커스텀할 수 있는 차이점이 있습니다.
   - beforeRender, beforeFilter, afterFilter, afterRender 메소드를 설정하여 미들웨어 이전, 이후 서비스를 정의합니다.
   - beforeRoutes, afterRoutes 객체를 설정하여 각 리소스가 라우팅 이전, 이후 라우팅을 정의합니다.
   - 각 리소스 Controller에서 적용되는 리퀘스트의 순환 순서는 다음과 같습니다.
     1. beforeRender
     2. beforeFilter
     3. beforeRoutedMiddlewares
     4. beforeRoutes
     5. routes
     6. afterRoutes
     7. afterRoutedMiddlewares
     8. afterFilter
     9. afterRender

### API 작성

#### ERD
##### 공통

1. created, modified, *_status 
    - 위 필드 세 개는 공통으로 작성했습니다.
    - created는 항상 필요했습니다.
    - modified는 필요 없어 보여도 나중에 필요할 경우가 생길 때가 가끔 있었습니다.
2. DELETE 쿼리문을 날리지 않을 예정입니다.
   - lectures의 경우에도, 나중에 결제 테이블과 관련이 있을 경우 레코드 자체가 사라지면 기술적인 문제를 유발할 수 있을 거라는 예상이 들었습니다.
   - 레코드 삭제가 필요한 경우, *_status 필드를 음수 이하의 값으로 설정해서 팀원 내에 명시하고, 삭제처리 취급 로직을 작성합니다.
   - 이후 정말로 레코드 삭제가 필요한 경우
     1. 백업을 충분히 하고 
     2. shell script 등을 작성
     3. *_status로 삭제처리 취급 로직이 작성된 레코드들을 선별하여서
     4. crontab 등으로 기간마다 3번의 레코드들만을 DELETE 쿼리를 날려야 한다고 생각하고 있습니다.



#### API

기본 HTML 코드는 BOOTSTRAP5에서 제공하는 예시 페이지를 사용했습니다.
view 엔진은 jade를 사용했습니다.


## 실행할 방법

npm install
npm start
