# 프로젝트 관리 툴

## 사용 라이브러리

1. Material Design
2. redux toolkit
3. axios
4. react-router-dom

## 기능 설명

### JWT 로그인을 통한 사용자 정보 관리

프로젝트 관리 툴은 JWT(JSON Web Token)를 사용하여 사용자 로그인 정보를 안전하게 관리합니다. 사용자가 로그인하면 JWT 토큰을 발급받고, 이 토큰을 사용하여 사용자 정보를 Redux에 저장합니다. 이를 통해 애플리케이션 전역에서 로그인한 사용자의 정보를 효율적으로 관리할 수 있습니다.

### 프로젝트 생성 및 관리

로그인한 사용자는 자신의 프로젝트를 생성하고 관리할 수 있습니다. 프로젝트를 생성할 때는 프로젝트명, 시작일, 종료일 등의 정보를 입력하여 새로운 프로젝트를 등록할 수 있습니다. 각 프로젝트는 사용자와 연동되어 있어, 사용자가 생성한 프로젝트만 조회할 수 있습니다.

### 콘텐츠 관리

각 프로젝트에는 여러 개의 콘텐츠가 포함될 수 있습니다. 사용자는 프로젝트 상세 페이지에서 해당 프로젝트에 속하는 콘텐츠를 추가하고 관리할 수 있습니다. 각 콘텐츠는 콘텐츠명, 완료 여부 등의 정보를 가지고 있으며, 완료 처리가 가능합니다.

### 메인 페이지에서의 프로젝트 목록 표시

사용자는 메인 페이지에서 자신이 생성한 모든 프로젝트 목록을 확인할 수 있습니다. 각 프로젝트는 프로젝트명, 총 콘텐츠 갯수, 완료된 콘텐츠 갯수, 시작일, 종료일 등의 정보를 표시합니다. 이를 통해 사용자는 각 프로젝트의 진행 상태를 한 눈에 파악할 수 있습니다.

### 프로젝트 삭제 시 하위 콘텐츠 자동 삭제

사용자가 프로젝트를 삭제할 경우, 해당 프로젝트에 속하는 모든 콘텐츠도 자동으로 삭제됩니다. 이를 통해 데이터 정합성을 유지하고 사용자 경험을 개선합니다.

### 권한 관리

각 사용자는 자신이 생성한 프로젝트만 볼 수 있으며, 다른 사용자가 생성한 프로젝트는 볼 수 없습니다. 이를 통해 프로젝트와 관련된 데이터는 각 사용자에게 적절히 제한된 범위에서만 접근할 수 있습니다.


```php
<?php
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use Firebase\JWT\Key;
header("Access-Control-Allow-Origin: *"); // 모든 출처에서 접근 허용
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // 사용할 HTTP 메서드 목록
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization"); // 허용할 헤더 목록
header("Content-Type: application/json; charset=UTF-8");

// 데이터베이스 연결 설정
$servername = "";
$username = "";
$password = "";
$dbname = "";

// JWT 설정
$secretKey = '';
$issuer = '';
$audience = '';
$issuedAt = time();
$expirationTime = $issuedAt + 3600;  // 토큰 유효 시간: 1시간

// 데이터베이스 연결
$conn = new mysqli($servername, $username, $password, $dbname);

// 연결 확인
if ($conn->connect_error) {
  die(json_encode(["error" => "데이터베이스 연결오류: " . $conn->connect_error]));
}
$conn->set_charset("utf8");

// 요청에서 데이터 가져오기
$request = json_decode(file_get_contents('php://input'), true);

if (!isset($request['cmd'])) {
  echo json_encode(["error" => "No command provided"]);
  exit();
}

$cmd = $request['cmd'];

switch ($cmd) {
  case 'login':
    if (!isset($request['user_id']) || !isset($request['user_pw'])) {
      echo json_encode(["error" => "아이디 및 비밀번호를 입력하세요."]);
      exit();
    }

    $user_id = $conn->real_escape_string($request['user_id']);
    $user_pw = $conn->real_escape_string($request['user_pw']);

    $sql = "SELECT user_id, user_name, user_level, user_pw FROM user_list WHERE user_id='$user_id'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
      $user = $result->fetch_assoc();
      $hashed_password = $user['user_pw'];

      // 비밀번호 복호화
      if (password_verify($user_pw, $hashed_password)) {
          // JWT 생성
          $payload = array(
            "iss" => $issuer,
            "aud" => $audience,
            "iat" => $issuedAt,
            "exp" => $expirationTime,
            "data" => array(
              "user_id" => $user['user_id'],
              "user_name" => $user['user_name'],
              "user_level" => $user['user_level']
            )
          );

          $jwt = JWT::encode($payload, $secretKey, 'HS256');

          echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "jwt" => $jwt,
            "user" => $user
          ]);
      } else {
        echo json_encode(["error" => "Invalid user ID or password"]);
      }
    } else {
      echo json_encode(["error" => "Invalid user ID or password"]);
    }
    break;
  case 'loginChk':
    if (!isset($request['jwt'])) {
      echo json_encode(["error" => "토큰이 없습니다."]);
      exit();
    }
    $jwt = $request['jwt'];
    try {
      // JWT 검증
      // $decoded = JWT::decode($jwt, $secretKey, 'HS256');
      $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
      $user_id = $decoded->data->user_id;

      // 사용자 정보 조회
      $sql = "SELECT user_id, user_name, user_level FROM user_list WHERE user_id='$user_id'";
      $result = $conn->query($sql);

      if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode([
          "success" => true,
          "user" => $user
        ]);
      } else {
        echo json_encode(["error" => "User not found"]);
      }
    } catch (Exception $e) {
      echo json_encode(["error" => "Invalid token"]);
    }
    break;
  case 'register':
    if (!isset($request['user_id']) || !isset($request['user_pw']) || !isset($request['user_name'])) {
      echo json_encode(["error" => "파라미터 오류"]);
      exit();
    }

    $user_id = $conn->real_escape_string($request['user_id']);
    $user_pw = password_hash($conn->real_escape_string($request['user_pw']), PASSWORD_DEFAULT); // SHA-256로 암호화
    $user_name = $conn->real_escape_string($request['user_name']);

    // 사용자 중복 확인
    $check_sql = "SELECT * FROM user_list WHERE user_id='$user_id'";
    $check_result = $conn->query($check_sql);
    if ($check_result->num_rows > 0) {
      echo json_encode(["error" => "이미 사용중인 아이디입니다."]);
      exit();
    }

    // 사용자 추가
    $insert_sql = "INSERT INTO user_list (user_id, user_pw, user_name) VALUES ('$user_id', '$user_pw', '$user_name')";
    if ($conn->query($insert_sql) === TRUE) {
      // 새로 추가된 사용자 정보 조회
      $sql = "SELECT user_id, user_name, user_level FROM user_list WHERE user_id='$user_id'";
      $result = $conn->query($sql);
      $user = $result->fetch_assoc();

      echo json_encode([
        "success" => true,
        "message" => "회원가입이 완료되었습니다.",
        "user" => $user
      ]);
    } else {
      echo json_encode(["error" => "Error: " . $conn->error]);
    }
    break;
  case 'insert_project':
    if (!isset($request['projectName']) || !isset($request['startDate']) || !isset($request['endDate']) || !isset($request['write_user'])) {
      echo json_encode(["error" => "파라미터 오류"]);
      exit();
    }

    $projectName = $conn->real_escape_string($request['projectName']);
    $startDate = $conn->real_escape_string($request['startDate']);
    $endDate = $conn->real_escape_string($request['endDate']);
    // $contentCount =  intval($conn->real_escape_string($request['contentCount']));
    $write_user = $conn->real_escape_string($request['write_user']);

    // 프로젝트 추가
    $insert_sql = "INSERT INTO project_list (projectName, startDate, endDate, write_user) VALUES ('$projectName', '$startDate', '$endDate', '$write_user')";
    if ($conn->query($insert_sql) === TRUE) {
      // 새로 추가된 사용자 정보 조회
      $sql = "SELECT * FROM project_list WHERE write_user='$write_user'";
      $result = $conn->query($sql);
      $projects = $result->fetch_all(MYSQLI_ASSOC);

      echo json_encode([
        "success" => true,
        "message" => "프로젝트 등록이 완료되었습니다.",
        "project" => $projects
      ]);
    } else {
      echo json_encode(["error" => "Error: " . $conn->error]);
    }
    break;
  case 'update_project':
    if (!isset($request['projectName']) || !isset($request['startDate']) || !isset($request['endDate']) || !isset($request['write_user']) || !isset($request['idx'])) {
      echo json_encode(["error" => "파라미터 오류"]);
      exit();
    }
    $idx =  intval($conn->real_escape_string($request['idx']));
    $projectName = $conn->real_escape_string($request['projectName']);
    $startDate = $conn->real_escape_string($request['startDate']);
    $endDate = $conn->real_escape_string($request['endDate']);
    $write_user = $conn->real_escape_string($request['write_user']);

    // 프로젝트 추가
    $update_sql = "UPDATE project_list SET projectName='$projectName', startDate='$startDate', endDate='$endDate', write_user='$write_user' WHERE idx='$idx'";
    if ($conn->query($update_sql) === TRUE) {
      // 새로 추가된 사용자 정보 조회
      $sql = "SELECT * FROM project_list WHERE write_user='$write_user'";
      $result = $conn->query($sql);
      $projects = $result->fetch_all(MYSQLI_ASSOC);

      echo json_encode([
        "success" => true,
        "message" => "프로젝트 수정이 완료되었습니다.",
        "project" => $projects
      ]);
    } else {
      echo json_encode(["error" => "Error: " . $conn->error]);
    }
    break;
    case 'delete_project':
      if (!isset($request['idx']) || !isset($request['write_user'])) {
          echo json_encode(["error" => "파라미터 오류"]);
          exit();
      }
  
      $idx = intval($conn->real_escape_string($request['idx']));
      $write_user = $conn->real_escape_string($request['write_user']);
  
      // 프로젝트 삭제
      $delete_project_sql = "DELETE FROM project_list WHERE idx='$idx' AND write_user='$write_user'";
      if ($conn->query($delete_project_sql) === TRUE) {
          // 연관된 콘텐츠 삭제
          $delete_contents_sql = "DELETE FROM content_list WHERE projectIdx='$idx'";
          if ($conn->query($delete_contents_sql) === TRUE) {
              // 삭제된 프로젝트 리스트 조회
              $select_sql = "SELECT * FROM project_list WHERE write_user='$write_user'";
              $result = $conn->query($select_sql);
              $projects = $result->fetch_all(MYSQLI_ASSOC);
  
              echo json_encode([
                  "success" => true,
                  "message" => "프로젝트 삭제가 완료되었습니다.",
                  "project" => $projects
              ]);
          } else {
              echo json_encode(["error" => "콘텐츠 삭제 오류: " . $conn->error]);
          }
      } else {
          echo json_encode(["error" => "프로젝트 삭제 오류: " . $conn->error]);
      }
      break;
  case 'insert_content':
    if (!isset($request['projectIdx']) || !isset($request['contentName'])) {
      echo json_encode(["error" => "파라미터 오류"]);
      exit();
    }
    $projectIdx =  intval($conn->real_escape_string($request['projectIdx']));
    $contentName = $conn->real_escape_string($request['contentName']);


    $insert_sql = "INSERT INTO content_list (projectIdx, contentName) VALUES ('$projectIdx', '$contentName')";
    if ($conn->query($insert_sql) === TRUE) {
        // content_list 테이블에서 해당 projectIdx의 모든 데이터 가져오기
        $sql_content_list = "SELECT * FROM content_list WHERE projectIdx='$projectIdx'";
        $result_content_list = $conn->query($sql_content_list);
        $content_list = $result_content_list->fetch_all(MYSQLI_ASSOC);
        $contentCount = count($content_list);

        // project_list 테이블에서 projectIdx에 해당하는 contentCount 업데이트
        $update_sql = "UPDATE project_list SET contentCount='$contentCount' WHERE idx='$projectIdx'";
        if ($conn->query($update_sql) === TRUE) {
            // project_list에서 해당 projectIdx의 데이터 다시 조회
            $sql_project_list = "SELECT * FROM project_list WHERE idx='$projectIdx'";
            $result_project_list = $conn->query($sql_project_list);
            $projects = $result_project_list->fetch_all(MYSQLI_ASSOC);

            echo json_encode([
                "success" => true,
                "message" => "프로젝트 등록이 완료되었습니다.",
                "project" => $projects,
                "contentList" => $content_list
            ]);
        } else {
            echo json_encode(["error" => "Error updating record: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
    break;
  case 'complate_content':
    if (!isset($request['idx']) || !isset($request['projectIdx'])) {
        echo json_encode(["error" => "파라미터 오류"]);
        exit();
    }

    $idx = intval($conn->real_escape_string($request['idx']));
    $projectIdx = intval($conn->real_escape_string($request['projectIdx']));

    // content_list 테이블에서 idx가 주어진 값과 일치하는 레코드의 complate 필드를 1로 업데이트
    $update_sql = "UPDATE content_list SET complate = 1 WHERE idx = '$idx'";
    if ($conn->query($update_sql) === TRUE) {
        // content_list 테이블에서 projectIdx가 주어진 값과 일치하는 레코드 개수 조회
        $count_sql = "SELECT COUNT(*) AS count FROM content_list WHERE projectIdx = '$projectIdx' AND complate = 1";
        $count_result = $conn->query($count_sql);
        $count_row = $count_result->fetch_assoc();
        $complateCount = $count_row['count'];

        // project_list 테이블에서 projectIdx가 주어진 값과 일치하는 레코드의 complateCount 필드 업데이트
        $update_project_sql = "UPDATE project_list SET complateCount = '$complateCount' WHERE idx = '$projectIdx'";
        if ($conn->query($update_project_sql) === TRUE) {
            // content_list에서 projectIdx가 주어진 값과 일치하는 레코드 전체 조회
            $sql_content_list = "SELECT * FROM content_list WHERE projectIdx = '$projectIdx'";
            $result_content_list = $conn->query($sql_content_list);
            $content_list = $result_content_list->fetch_all(MYSQLI_ASSOC);

            echo json_encode([
                "success" => true,
                "message" => "컨텐츠 완료 처리가 완료되었습니다.",
                "contentList" => $content_list
            ]);
        } else {
            echo json_encode(["error" => "Error updating complateCount: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Error updating record: " . $conn->error]);
    }

    break;
  case 'load_project':
    if (!isset($request['write_user'])) {
      echo json_encode(["error" => "파라미터 오류"]);
      exit();
    }
    $write_user = $conn->real_escape_string($request['write_user']);
    // 프로젝트 추가
    $sql = "SELECT * FROM project_list WHERE write_user='$write_user'";
    $result = $conn->query($sql);
    if ($result) {
      $projects = $result->fetch_all(MYSQLI_ASSOC);

      echo json_encode([
        "success" => true,
        "message" => "프로젝트 로딩 완료.",
        "project" => $projects
      ]);
    } else {
      echo json_encode(["error" => "Error: " . $conn->error]);
    }
    break;
  case 'load_content':
    if (!isset($request['projectIdx'])) {
      echo json_encode(["error" => "파라미터 오류"]);
      exit();
    }
    $projectIdx =  intval($conn->real_escape_string($request['projectIdx']));
    // 프로젝트 추가
    $sql = "SELECT * FROM content_list WHERE projectIdx='$projectIdx'";
    $result = $conn->query($sql);
    if ($result) {
      $contents = $result->fetch_all(MYSQLI_ASSOC);

      echo json_encode([
        "success" => true,
        "message" => "콘텐츠 로딩 완료.",
        "project" => $contents
      ]);
    } else {
      echo json_encode(["error" => "Error: " . $conn->error]);
    }
    break;
  default:
    echo json_encode(["error" => "Invalid command"]);
    break;
}

$conn->close();
?>

```
