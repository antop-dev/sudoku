<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="json" uri="http://www.atg.com/taglibs/json"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<json:object>
	<c:import url="../success.jsp" charEncoding="UTF-8" />
	<json:property name="seq" value="${sudoku.seq}" />
</json:object>