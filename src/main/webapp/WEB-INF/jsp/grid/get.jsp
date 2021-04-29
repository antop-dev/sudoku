<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="json" uri="http://www.atg.com/taglibs/json"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<json:object>
	<c:import url="../success.jsp" charEncoding="UTF-8" />
	<c:if test="${sudoku != null}">
		<json:object name="sudoku">
			<json:property name="seq" value="${sudoku.seq}" />
			<json:property name="grid" value="${sudoku.grid}" />
			<json:property name="created" value="${sudoku.created}" />
			<json:property name="modified" value="${sudoku.modified}" />
		</json:object>
	</c:if>
</json:object>