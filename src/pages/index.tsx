import Link from 'next/link';
import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <ul>
        <li>
          <Link href={'/stores'}>맛집 목록</Link>
        </li>
        <li>
          <Link href={'/stores/new'}>맛집 생성</Link>
        </li>
        <li>
          <Link href={'/stores/1'}>맛집 상세 페이지</Link>
        </li>
        <li>
          <Link href={'/stores/1/edit'}>맛집 수정 페이지</Link>
        </li>
        <li>
          <Link href={'/users/login'}>로그인 페이지</Link>
        </li>
        <li>
          <Link href={'/users/likes'}>맛집 수정 페이지</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
